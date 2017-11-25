import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Channel} from '../../classes/channel';
import {TemplateEngine} from '../../interfaces/template-engine.enum';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-channel-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  /**
   * Constructor
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private translateService: TranslateService,
              private storageService: StorageService) {
  }

  /**
   * New channel instance
   *
   * @type {Channel}
   */
  public channel: Channel;

  /**
   * @inheritDoc
   */
  ngOnInit() {
    // New channel
    this.channel = new Channel();
    // Get default name
    this.translateService.get('new_channel_name').subscribe((text) => {
      this.channel.name = text;
    });
    // Get default name
    this.translateService.get('new_template_name').subscribe((text) => {
      // Default template
      const template = this.channel.newTemplate();
      template.name = text;
      template.path = 'path/to/file.js';
      // Push template to channel
      this.channel.addTemplate(template);
    });
  }

  /**
   * Called when the user save the new channel
   */
  onSave(): void {
    // Store the channel
    this.storageService.add(this.channel)
      .then(() => {
        // Go to edit page
        this.router.navigate(['../edit', this.channel.id], {relativeTo: this.route});
      });
  }


}
