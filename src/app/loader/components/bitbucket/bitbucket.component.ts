import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';
import {BitbucketService} from '../../services/bitbucket.service';

@Component({
  selector: 'app-bitbucket',
  templateUrl: './bitbucket.component.html',
  styleUrls: ['./bitbucket.component.scss']
})
export class BitbucketComponent implements OnInit {

  /**
   * Denotes if the user is currently connected to Bitbucket via OAuth
   *
   * @type {boolean}
   */
  connected = false;

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
              private route: ActivatedRoute) {}

  /**
   * On init
   */
  ngOnInit() {
    this.connected = this.bitbucketService.isConnected();
    // subscribe to router event
    this.route.queryParams.subscribe((params: Params) => {
      const code = params['code'];
      if (code) {
        this.bitbucketService.setToken(code);
        // Remove code from URL
        this.location.replaceState(this.router.url.split('?')[0], '');
        this.connected = true;
      }
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
    this.connected = false;
  }

}
