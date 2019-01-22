import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeBranch } from '../../interfaces/tree-branch';
import { ITemplate } from '@app/channel/interfaces/template';

@Component({
	selector: 'app-channel-tree',
	templateUrl: './tree.component.html',
	styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
	@Input()
	set tree(value: TreeBranch[]) {
		this._tree = value;
		this._tree.map(branch => {
			this.isOpen[branch.path] = this.isOpen[branch.path] || false;
			this.types[branch.path] =
				this.types[branch.path] || this.getType(branch); // Avoid re-compute
		});
	}
	get tree(): TreeBranch[] {
		return this._tree;
	}
	@Input() rootPath = '';
	@Input() selectedPath = '';
	@Input() addTemplateDisabled = false;
	@Output() selectBranch = new EventEmitter<TreeBranch>();
	@Output() addTemplate = new EventEmitter<string>();
	@Output() removeTemplate = new EventEmitter<TreeBranch>();

	newTemplatePath = '';
	private _tree: TreeBranch[];
	isOpen: { [key: string]: boolean } = {};
	types: { [key: string]: string } = {};

	confirmDeletion = false;

	constructor() {}

	ngOnInit() {
		if (this.selectedPath.length) {
			this._tree.map(branch => {
				this.isOpen[branch.path] = this.selectedPath.startsWith(
					branch.path
				);
			});
		}
	}

	/** Get File extension*/
	private getType(branch: TreeBranch): string {
		if (branch.children.length) {
			return 'folder';
		}
		const parts = branch.name
			.replace(/{[a-z]+\.[a-z]+}/gi, 'DYN') // Replace dynamic paths
			.split('.');
		if (parts.length < 2) {
			return 'file';
		}
		return parts[parts.length - 1];
	}

	isSelected(branch: TreeBranch): boolean {
		if (this.selectedPath.endsWith('/')) {
			return this.selectedPath === `${branch.path}/`;
		} else {
			return this.selectedPath === branch.path;
		}
	}
	onAddTemplate(): void {
		if (this.addTemplateDisabled || this.newTemplatePath.length === 0) {
			return;
		}
		const path = this.rootPath.length
			? `${this.rootPath}/${this.newTemplatePath}`
			: this.newTemplatePath;
		this.addTemplate.emit(path);
		this.newTemplatePath = '';
	}
}
