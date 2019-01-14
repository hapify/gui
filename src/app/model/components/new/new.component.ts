import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Model } from '../../classes/model';
import { StorageService } from '../../services/storage.service';

@Component({
	selector: 'app-model-new',
	templateUrl: './new.component.html',
	styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, AfterViewInit {
	/**
	 * Constructor
	 */
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private translateService: TranslateService,
		private storageService: StorageService
	) {}

	/**
	 * New model instance
	 *
	 * @type {Model}
	 */
	public model: Model;

	/** @type {EventEmitter<void>} Notify save */
	@Output() create = new EventEmitter<void>();

	@ViewChild('name') nameInput: ElementRef;

	/**
	 * @inheritDoc
	 */
	ngOnInit() {
		// New model
		this.model = new Model();
		// Default field(s)
		const primary = this.model.newField();
		primary.name = '_id';
		primary.primary = true;
		primary.internal = true;
		this.model.addField(primary);
		const creation = this.model.newField();
		creation.name = 'created_at';
		creation.type = 'datetime';
		creation.internal = true;
		creation.sortable = true;
		this.model.addField(creation);
		// Get default name
		/*this.translateService.get('new_model_name').subscribe(text => {
			this.model.name = text;
		});*/
		this.model.name = '';
	}

	ngAfterViewInit() {
		this.nameInput.nativeElement.focus();
	}

	/**
	 * Called when the user save the new model
	 */
	save(): void {
		// Store the model
		this.storageService.add(this.model);
		this.create.emit();
	}
}
