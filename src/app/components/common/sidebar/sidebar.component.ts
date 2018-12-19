import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ResizeService } from '@app/services/resize.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
	@Input() reduced = false;
	unsubscribe = new Subject<void>();
	breakpoint = this.resizeService.currentBreakpoint;

	constructor(private resizeService: ResizeService) {}

	ngOnInit() {
		this.resizeService.breakpointChanges
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(breakpointInfo => {
				this.breakpoint = breakpointInfo.current;
			});
	}

	ngOnDestroy() {
		this.unsubscribe.next();
	}
}
