import {
	AfterViewInit,
	Component,
	ElementRef,
	HostListener,
	OnInit,
	Renderer2,
	ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WebSocketService } from './services/websocket.service';
import { ResizeService } from '@app/services/resize.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	sidebarIsReduced = false;
	breakpoint = this.resizeService.currentBreakpoint;

	@ViewChild('scrollzone') scrollzone: ElementRef;
	scrollTimeout;

	constructor(
		translate: TranslateService,
		webSocketService: WebSocketService,
		private resizeService: ResizeService,
		private renderer: Renderer2
	) {
		// this language will be used as a fallback when a translation isn't found in the current language
		translate.setDefaultLang('en');

		// the lang to use, if the lang isn't available, it will use the current loader to get them
		translate.use(translate.getBrowserLang());

		// Init websocket
		webSocketService.handshake();
	}

	ngOnInit() {
		this.resizeService.breakpointChanges.subscribe(breakpointInfo => {
			this.breakpoint = breakpointInfo.current;
		});
	}

	test() {
		this.renderer.addClass(this.scrollzone.nativeElement, 'scrolling');
		clearTimeout(this.scrollTimeout);
		this.scrollTimeout = setTimeout(() => {
			this.renderer.removeClass(
				this.scrollzone.nativeElement,
				'scrolling'
			);
		}, 500);
	}
}
