import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	Injector
} from '@angular/core';
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
	@Output() save = new EventEmitter<ITemplate | null>();
	/** @type {string} */
	defaultTemplateName = 'New template';
	/** @type {string} */
	defaultTemplatePath = '/path/to/{model.hyphen}';
	/** @type {boolean} */
	syncing = false;
	/** Current edited template */
	currentEditedTemplate: ITemplate;
	/** @type {boolean} */
	showValidatorEditor = false;
	/** @type {TreeBranch[]} */
	tree: TreeBranch[];
	selectedPath = '';
	templatesToDisplay: { [key: string]: boolean } = {};

	/**
	 * Constructor
	 * @param {Injector} injector
	 */
	constructor(private injector: Injector) {
		// Avoid circular dependency
		this.generatorService = this.injector.get(GeneratorService);
	}

	/**
	 * @inheritDoc
	 */
	ngOnInit() {
		this.updateTree();
	}

	/**
	 * Update the tree and filters
	 */
	updateTree(): void {
		this.tree = this.buildTree();
		this.filterTemplates();
	}

	/**
	 * Get the tree
	 */
	private buildTree(): TreeBranch[] {
		const tree = [];

		this.channel.templates.forEach(template => {
			const pathParts = template.splitPath();

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
	 * Filters templates to display
	 */
	filterTemplates(): void {
		this.templatesToDisplay = {};
		for (const template of this.channel.templates) {
			this.templatesToDisplay[template.path] = template.path.startsWith(
				this.selectedPath
			);
		}
	}

	/**
	 * Called when the user click on "save"
	 * @param {ITemplate|null} toGenerate
	 */
	onSave(toGenerate: ITemplate | null) {
		this.save.emit(toGenerate);
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
}
