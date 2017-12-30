import {Component, OnInit} from '@angular/core';
import {DemoService} from '../../../services/demo.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /**
   * @var {Boolean}
   */
  loadingDemo = false;

  constructor(private demoService: DemoService) {
  }

  ngOnInit() {
  }

  /**
   * Called when the user click on load demo
   */
  onLoadDemo(): void {
    this.loadingDemo = true;
    this.demoService
      .load()
      .then(() => {
        this.loadingDemo = false;
      });
  }

}
