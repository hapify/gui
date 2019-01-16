import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
	name: 'translateEntry',
	pure: false
})
export class TranslateEntryPipe implements PipeTransform {
	constructor(private _translateService: TranslateService) {}

	transform(value: any, args?: any): any {
		return value[
			args +
				(this._translateService.currentLang === 'en'
					? ''
					: '__' + this._translateService.currentLang)
		];
	}
}
