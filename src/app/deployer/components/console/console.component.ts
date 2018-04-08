import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {IDeployerMessage} from '../../interfaces/deployer-message';
import {DeployerService} from '../../services/deployer.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-deployer-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit, OnDestroy {

  /**
   * @type {string}
   */
  branch = 'develop';
  /**
   * @type {[string]}
   */
  branches = [
    'master',
    'develop'
  ];
  /**
   * @type {string}
   */
  name = '';
  /**
   *
   * @type {boolean}
   */
  pending = false;
  /**
   * @type {FormGroup}
   */
  form: FormGroup;
  /**
   * @type {number}
   */
  minLength = 1;
  /**
   * @type {number}
   */
  maxLength = 32;
  /**
   * @type {{minLength: number; maxLength: number}}
   */
  translateParams = {
    minLength: this.minLength,
    maxLength: this.maxLength,
  };
  /**
   * Received mesaages list
   *
   * @type {IDeployerMessage[]}
   */
  messages: IDeployerMessage[];
  /**
   * Observables subscriptions
   *
   * @type {Subscription[]}
   */
  private subs: Subscription[] = [];

  /**
   * Constructor
   *
   * @param {FormBuilder} formBuilder
   * @param {DeployerService} deployerService
   */
  constructor(private formBuilder: FormBuilder,
              private deployerService: DeployerService) {
    this.messages = [];
  }

  /**
   * On Init
   */
  ngOnInit() {
    // Form validator
    this.form = this.formBuilder.group({
      name: new FormControl(this.name, [
        Validators.required,
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength),
      ]),
      branch: new FormControl(this.branch, [
        Validators.required,
      ]),
    });
    // New message from server
    this.subs.push(this.deployerService.messages().subscribe((message: IDeployerMessage) => {
      if (message) {
        this.messages.unshift(message);
        // In case of error the server stop doing anything for us
        if (message.type === 'error') {
          this.pending = false;
        }
        // In case of success
        if (message.type === 'success') {
          this.pending = false;
        }
      }
    }));
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    this.subs.map((s) => s.unsubscribe());
  }

  /**
   * Called when the user click on "save"
   */
  async onSubmit() {
    // Clear message queue
    this.messages = [];
    // Set pending
    this.pending = true;
    // Connect to server and start process
    await this.deployerService.run({
      name: this.name,
      branch: this.branch,
      populate: true,
    });
  }


}
