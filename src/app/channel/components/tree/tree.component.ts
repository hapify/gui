import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges
} from '@angular/core';
import { TreeBranch } from '@app/channel/components/channel/channel.component';

@Component({
	selector: 'app-tree',
	templateUrl: './tree.component.html',
	styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
	@Input() tree: TreeBranch[];
	@Input() selectedPath = '';
	@Output() selectPath = new EventEmitter<string>();

	isOpen: { [key: string]: boolean } = {};
	types: { [key: string]: string } = {};

	constructor() {}

	ngOnInit() {
		// Init isOpen object
		this.tree.map(branch => {
			this.isOpen[branch.path] = false;
			this.types[branch.path] = this.getType(branch.path);
		});
	}

	/** Get File extension*/
	private getType(name: string): string {
		const regex = /\.[a-z]+$/gm;
		let m;
		let extension = '';

		while ((m = regex.exec(name)) !== null) {
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}
			if (m) {
				extension = m[0].slice(1);
			}
		}

		if (extension.length) {
			return extension;
		} else {
			return 'folder';
		}
	}

	onSelectPath(path: string) {
		this.selectedPath = path;
		this.selectPath.emit(path);
	}
}
