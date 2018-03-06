import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {BitbucketService, GroupedBitbucketRepositories} from '../../services/bitbucket.service';
import {Subscription} from 'rxjs/Subscription';
import {IBitbucketUser} from '../../interfaces/bitbucket-user';
import {IBitbucketRepository} from '../../interfaces/bitbucket-repository';

@Component({
  selector: 'app-bitbucket',
  templateUrl: './bitbucket.component.html',
  styleUrls: ['./bitbucket.component.scss']
})
export class BitbucketComponent implements OnInit, OnDestroy {

  /**
   * Current user loaded via bitbucket
   *
   * @type {IBitbucketUser}
   */
  user: IBitbucketUser;

  /**
   * Repositories loaded via bitbucket
   *
   * @type {GroupedBitbucketRepositories}
   */
  repositories: GroupedBitbucketRepositories;

  /**
   * @type {Subscription[]}
   */
  private _subscriptions: Subscription[];

  /**
   * Constructor
   *
   * @param {BitbucketService} bitbucketService
   * @param {Router} router
   * @param {Location} location
   * @param {ActivatedRoute} route
   */
  constructor(private bitbucketService: BitbucketService,
              private router: Router,
              private location: Location,
              private route: ActivatedRoute) {
  }

  /**
   * On init
   */
  ngOnInit() {
    this._subscriptions = [
      // Subscribe to user
      this.bitbucketService.getUser().subscribe((user: IBitbucketUser) => {
        this.user = user;
      }),
      // Subscribe to repositories
      this.bitbucketService.getRepositories().subscribe((repositories: GroupedBitbucketRepositories) => {
        this.repositories = repositories;
      }),
      // subscribe to router event
      this.route.fragment.subscribe((fragment: string) => {
        const token = this.bitbucketService.extractToken(fragment);
        if (token) {
          this.bitbucketService.setToken(token);
          // Remove code from URL
          this.location.replaceState(this.router.url.split('#')[0], '');
        }
      })
    ];
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    this._subscriptions.map((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  /**
   * Connect to Bitbucket
   */
  onConnectClick() {
    this.bitbucketService.connect();
  }

  /**
   * Disconnect from Bitbucket
   */
  onDisconnectClick() {
    this.bitbucketService.disconnect();
  }

  /**
   * @param {IBitbucketRepository} repository
   */
  onLoadTemplateClick(repository: IBitbucketRepository) {

  }

  /**
   * @param {IBitbucketRepository} repository
   */
  onLoadBootstrapClick(repository: IBitbucketRepository) {
    console.log(repository);
    this.bitbucketService.getRepositorySource(repository);
  }

  /**
   * @param {IBitbucketRepository} repository
   */
  onLoadModelClick(repository: IBitbucketRepository) {

  }

}
