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

export interface TreeBranch {
	name: string;
	path: string;
	children: TreeBranch[];
}

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
	/** Current edited template */
	currentEditedTemplate: ITemplate;
	/** @type {{minLength: number; maxLength: number}} */
	translateParams = {
		minLength: this.minLength,
		maxLength: this.maxLength
	};
	/** @type {boolean} */
	showValidatorEditor = false;
	/** @type {TreeBranch[]} */
	tree: TreeBranch[];
	selectedPath = '';

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

		this.tree = this.buildTree();
	}

	buildTree(): TreeBranch[] {
		const tree = [];

		this.channel.templates.forEach(template => {
			const pathParts = template.path.split('/');

			let currentLevel = tree;
			let parentPath = '';
			pathParts.forEach(pathPart => {
				if (currentLevel) {
					const existingPathPart = currentLevel.filter(
						level => level.name === pathPart
					);
					if (existingPathPart.length) {
						parentPath = parentPath
							? parentPath + '/' + existingPathPart[0]['name']
							: existingPathPart[0]['name'];
						currentLevel = existingPathPart[0]['children'];
					} else {
						parentPath = parentPath
							? parentPath + '/' + pathPart
							: pathPart;
						const newPathPart = {
							name: pathPart,
							path: parentPath,
							children: []
						};
						currentLevel.push(newPathPart);
						currentLevel = newPathPart['children'];
					}
				}
			});
		});
		return tree;
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

	/**
	 * Called when the user click on "Open Editor" button
	 */
	onShowEditor(template: ITemplate) {
		this.currentEditedTemplate = template;
	}

	/**
	 * Called when the editor is saved
	 */
	onEditorClose() {
		this.currentEditedTemplate = null;
	}

	/**
	 * Called when the editor is saved
	 * @param {ITemplate|null} toGenerate
	 */
	onEditorSave(toGenerate: ITemplate | null) {
		this.onSubmit(toGenerate);
	}

	/**
	 * Toggle template card display
	 */
	matchPath(path: string): boolean {
		return path.indexOf(this.selectedPath) > -1;
	}

	/** Update models properties from inputs values */
	private updateModel(): void {
		for (const key of Object.keys(this.form.controls)) {
			this.channel[key] = this.form.get(key).value;
		}
	}
}
