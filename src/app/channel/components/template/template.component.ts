import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITemplate } from '../../interfaces/template';
import { TemplateEngine } from '../../interfaces/template-engine.enum';
import { TemplateInput } from '../../interfaces/template-input.enum';

@Component({
	selector: 'app-channel-template',
	templateUrl: './template.component.html',
	styleUrls: ['./template.component.scss']
})
export class TemplateComponent {
	/** Constructor */
	constructor() {}
	/** New template instance */
	@Input() template: ITemplate;
	/** Show editor */
	@Output() showEditor = new EventEmitter<void>();
	/** Available engines */
	engines: {
		value: string;
		name: string;
	}[] = [
		{ name: 'Hapify', value: TemplateEngine.Hpf },
		{ name: 'JavaScript', value: TemplateEngine.JavaScript }
	];
	/**
	 * Available inputs
	 */
	inputs: {
		value: string;
		name: string;
	}[] = [
		{ name: 'template_input_one', value: TemplateInput.One },
		{ name: 'template_input_all', value: TemplateInput.All }
	];
	/** Called when the user click on "Open Editor" button */
	onShowEditor() {
		this.showEditor.emit();
	}

	/** Get File extension*/
	getType(name: string): string {
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
}
