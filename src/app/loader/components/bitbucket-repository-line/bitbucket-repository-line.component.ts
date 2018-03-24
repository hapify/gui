import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBitbucketRepository} from '../../interfaces/bitbucket-repository';

@Component({
  selector: 'app-loader-bitbucket-repository-line',
  templateUrl: './bitbucket-repository-line.component.html',
  styleUrls: ['./bitbucket-repository-line.component.scss']
})
export class BitbucketRepositoryLineComponent implements OnInit {

  /**
   * Repository objects
   */
  @Input() repository: IBitbucketRepository;

  /**
   * Triggered when the user click on download
   *
   * @type {EventEmitter<void>}
   */
  @Output() onLoad = new EventEmitter<void>();

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * On init
   */
  ngOnInit() {
  }

  /**
   * Compare branch names
   *
   * @param item1
   * @param item2
   * @return {boolean}
   */
  byName(item1, item2) {
    return item1 && item2 && item1.name === item2.name;
  }

  /**
   * Called when the user click on download
   */
  onLoadClick() {
    this.onLoad.emit();
  }

}
