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
				this.types[branch.path] || this.getType(branch.path); // Avoid re-compute
		});
	}
	get tree(): TreeBranch[] {
		return this._tree;
	}
	@Input() rootPath = '';
	@Input() selectedPath = '';
	@Output() selectBranch = new EventEmitter<TreeBranch>();
	@Output() addTemplate = new EventEmitter<string>();
	@Output() removeTemplate = new EventEmitter<ITemplate>();

	newTemplatePath = '';
	private _tree: TreeBranch[];
	isOpen: { [key: string]: boolean } = {};
	types: { [key: string]: string } = {};

	confirmDeletion = false;

	constructor() {}

	ngOnInit() {}

	/** Get File extension*/
	private getType(name: string): string {
		const parts = name
			.replace(/{[a-z]+\.[a-z]+}/gi, 'DYN') // Replace dynamic paths
			.split('.');
		if (parts.length < 2) {
			return 'folder';
		}
		return parts[parts.length - 1];
	}

	onSelectBranch(branch: TreeBranch) {
		this.selectedPath = branch.path;
		this.selectBranch.emit(branch);
	}

	isSelected(branch: TreeBranch): boolean {
		if (this.selectedPath.endsWith('/')) {
			return this.selectedPath === `${branch.path}/`;
		} else {
			return this.selectedPath === branch.path;
		}
	}
	onAddTemplate(): void {
		if (this.newTemplatePath.length === 0) {
			return;
		}
		const path = this.rootPath.length
			? `${this.rootPath}/${this.newTemplatePath}`
			: this.newTemplatePath;
		this.addTemplate.emit(path);
		this.newTemplatePath = '';
	}
}
