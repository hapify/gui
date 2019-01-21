import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeBranch } from '@app/channel/components/channel/channel.component';

@Component({
	selector: 'app-tree',
	templateUrl: './tree.component.html',
	styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
	@Input() set tree(value: TreeBranch[]) {
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
	@Input() selectedPath = '';
	@Output() selectPath = new EventEmitter<string>();

	private _tree: TreeBranch[];
	isOpen: { [key: string]: boolean } = {};
	types: { [key: string]: string } = {};

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

	onSelectPath(path: string) {
		this.selectedPath = path;
		this.selectPath.emit(path);
	}
}
