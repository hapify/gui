import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	Injector
} from '@angular/core';
import { GeneratorService } from '../../services/generator.service';
import { IChannel } from '../../interfaces/channel';
import { ITemplate } from '../../interfaces/template';
import { TreeBranch } from '../../interfaces/tree-branch';
import { InfoService } from '@app/services/info.service';
import { IInfo } from '@app/interfaces/info';

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
	info: IInfo;

	/** Constructor */
	constructor(private injector: Injector, private infoService: InfoService) {
		// Avoid circular dependency
		this.generatorService = this.injector.get(GeneratorService);
		this.infoService.info().then(info => {
			this.info = info;
		});
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
							? `${parentPath}/${existingPathPart[0].name}`
							: existingPathPart[0].name;
						currentLevel = existingPathPart[0].children;
					} else {
						const rootPath = parentPath;
						parentPath = parentPath
							? `${parentPath}/${pathPart}`
							: pathPart;
						const newPathPart = {
							name: pathPart,
							path: parentPath,
							root: rootPath,
							children: []
						};
						currentLevel.push(newPathPart);
						currentLevel = newPathPart.children;
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
	 * Called when a branch is selected
	 */
	onSelectBranch(branch: TreeBranch) {
		this.selectedPath = branch.children.length
			? `${branch.path}/`
			: branch.path;
		this.filterTemplates();
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
	onAddTemplate(path: string) {
		const template = this.channel.newTemplate();
		template.name = path;
		template.path = path;
		template.content = '';
		this.channel.addTemplate(template);
		this.updateTree();
	}

	/**
	 * Called when the user click on "remove templates"
	 */
	onRemoveTemplate(branch: TreeBranch) {
		const template = this.channel.templates.find(
			t => t.path === branch.path
		);
		if (template) {
			this.channel.removeTemplate(template);
			// Force selected path to parent path
			this.selectedPath = branch.root;
			this.updateTree();
		}
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
