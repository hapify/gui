import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as marked from 'marked';

@Component({
	selector: 'app-documentation',
	templateUrl: './documentation.component.html',
	styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {
	objectKeys = Object.keys;
	marked = marked;
	documents = {
		cli: {
			title: 'Command Line Interface',
			content: ''
		},
		syntax: {
			title: 'Hapify Syntax',
			content: ''
		}
	};

	selectedDoc = 'cli';

	constructor(private http: HttpClient) {}

	ngOnInit() {
		this.http
			.get('/assets/docs/cli.md', { responseType: 'text' })
			.toPromise()
			.then(data => {
				console.log(data);
				this.documents.cli.content = data;
			});
		this.http
			.get('/assets/docs/syntax.md', { responseType: 'text' })
			.toPromise()
			.then(data => {
				this.documents.syntax.content = data;
			});
	}
}
