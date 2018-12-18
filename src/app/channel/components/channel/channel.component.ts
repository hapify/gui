import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	Injector
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	FormControl,
	Validators
} from '@angular/forms';
import { IChannel } from '../../interfaces/channel';
import { GeneratorService } from '../../services/generator.service';
import { ITemplate } from '../../interfaces/template';

@Component({
	selector: 'app-channel-channel',
	templateUrl: './channel.component.html',
	styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
	/** @type {GeneratorService} The generator service */
	generatorService: GeneratorService;
	/** @type {IChannel} Channel instance */
	@Input() channel: IChannel;
	/** @type {EventEmitter<ITemplate|null>} On save event */
	@Output() onSave = new EventEmitter<ITemplate | null>();
	/** @type {FormGroup} */
	form: FormGroup;
	/** @type {number} */
	minLength = 2;
	/** @type {number} */
	maxLength = 32;
	/** @type {string} */
	defaultTemplateName = 'New template';
	/** @type {string} */
	defaultTemplatePath = '/path/to/{model.hyphen}';
	/** @type {boolean} */
	syncing = false;
	/** @type {{minLength: number; maxLength: number}} */
	translateParams = {
		minLength: this.minLength,
		maxLength: this.maxLength
	};
	/** @type {boolean} */
	showValidatorEditor = false;

	/**
	 * Constructor
	 * @param {FormBuilder} formBuilder
	 * @param {Injector} injector
	 */
	constructor(private formBuilder: FormBuilder, private injector: Injector) {
		// Avoid circular dependency
		this.generatorService = this.injector.get(GeneratorService);
	}

	/**
	 * @inheritDoc
	 */
	ngOnInit() {
		// Form validator
		this.form = this.formBuilder.group({
			name: new FormControl(this.channel.name, [
				Validators.required,
				Validators.minLength(this.minLength),
				Validators.maxLength(this.maxLength)
			])
		});
	}

	/**
	 * Called when the user click on "save"
	 * @param {ITemplate|null} toGenerate
	 */
	onSubmit(toGenerate: ITemplate | null) {
		this.updateModel();
		this.onSave.emit(toGenerate);
	}

	/**
	 * Will sync all templates of the channel
	 */
	async onGenerate() {
		this.syncing = true;
		await this.generatorService.compileChannel(this.channel);
		this.syncing = false;
	}

	/**
	 * Called when the user click on "add template"
	 */
	addTemplate() {
		const template = this.channel.newTemplate();
		template.name = this.defaultTemplateName;
		template.path = this.defaultTemplatePath;
		this.channel.addTemplate(template);
	}

	/**
	 * Called when the user click on "clean templates"
	 */
	cleanTemplates() {
		this.channel.filter();
	}

	/**
	 * Called when the user click on "Open Validator Editor" button
	 */
	onShowValidatorEditor() {
		this.showValidatorEditor = true;
	}

	/**
	 * Called when the ValidatorEditor is saved
	 */
	onValidatorEditorSave() {
		this.onSave.emit();
	}

	/**
	 * Called when the ValidatorEditor is saved
	 */
	onValidatorEditorClose() {
		this.showValidatorEditor = false;
	}

	/** Update models properties from inputs values */
	private updateModel(): void {
		for (const key of Object.keys(this.form.controls)) {
			console.log(this.channel[key], this.form.get(key).value);
			this.channel[key] = this.form.get(key).value;
		}
	}
}
