import { Injectable } from '@angular/core';
import {StringService} from './string.service';
import {ConfigService} from './config.service';

declare const ace: any;

@Injectable()
export class AceService {

  /**
   * Map between file extension and ace mode
   *
   * @type {any}
   * @private
   */
  private _modeMap: any = {
    js: 'javascript',
    ts: 'typescript',
    md: 'markdown'
  };

  /**
   * Constructor
   */
  constructor(private stringService: StringService,
              private configService: ConfigService) {
    // Set base url for ace
    ace.config.set('basePath', this.configService.getAceBaseUri());
  }

  /**
   * Returns the main theme
   *
   * @return {string}
   */
  theme(): string {
    return this.configService.getAceTheme();
  }

  /**
   * Returns the mode for a path
   *
   * @param {string} path
   * @param {boolean} parse
   *  Should parse path to extract extension (default: true)
   * @return {string}
   */
  mode(path: string, parse: boolean = true): string {
    const ext = parse ?
      this.stringService.extension(path) : path;
    if (ext && typeof this._modeMap[ext] === 'string') {
      return this._modeMap[ext];
    }
    return ext;
  }

}
