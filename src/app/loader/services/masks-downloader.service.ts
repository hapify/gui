import {Injectable} from '@angular/core';
import {IChannelManifest, IMasksManifest} from '../interfaces/masks-manifest';
import {IChannel} from '../../channel/interfaces/channel';
import {SentenceFormat} from '../../interfaces/sentence-format.enum';
import {StringService} from '../../services/string.service';
import {ITemplate} from '../../channel/interfaces/template';

import JSZip from 'jszip';
import FileSaver from 'file-saver';

@Injectable()
export class MasksDownloaderService {

  /**
   * @type {string}
   */
  private manifestPath = 'masks.json';
  
  /**
   * @type {string}
   */
  private pathPrefix = 'src/';

  /**
   * Constructor
   *
   * @param {StringService} stringService
   */
  constructor(private stringService: StringService) {
  }

  /**
   * Download all files in a ZIP
   *
   * @param {IChannel} channel
   * @returns {Promise<void>}
   */
  async downloadAsZip(channel: IChannel): Promise<void> {
    // For each template, save the file
    const zip = new JSZip();
    const channelManifest: IChannelManifest = {
      id: channel.id,
      name: channel.name,
      masks: []
    };
    channel.templates.forEach((template: ITemplate) => {
      const path = this._pathForDownload(template);
      // Add file to zip
      zip.file(path, template.content);
      // Add file to list
      const file = template.toObject();
      file.content = path;
      channelManifest.masks.push(file);
    });
    const masksManifest: IMasksManifest = {
      channels: [channelManifest]
    };
    // Add JSON to ZIP
    zip.file(this.manifestPath, JSON.stringify(masksManifest, null, 2));

    const blob = await zip.generateAsync({type: 'blob'});
    const filename = `${channel.name}.zip`;
    FileSaver.saveAs(blob, filename);
  }

  /**
   * Compute source path for a "one model" template
   *
   * @param {ITemplate} template
   * @returns {string}
   * @private
   */
  private _pathForDownload(template: ITemplate): string {

    // Get path
    let path = template.path;

    const folderName = 'model';

    // Apply replacements
    path = path.replace(/{model\.hyphen}/g, this.stringService.format(folderName, SentenceFormat.SlugHyphen));
    path = path.replace(/{model\.underscore}/g, this.stringService.format(folderName, SentenceFormat.SlugUnderscore));
    path = path.replace(/{model\.oneWord}/g, this.stringService.format(folderName, SentenceFormat.SlugOneWord));
    path = path.replace(/{model\.upperCamel}/g, this.stringService.format(folderName, SentenceFormat.UpperCamelCase));
    path = path.replace(/{model\.lowerCamel}/g, this.stringService.format(folderName, SentenceFormat.LowerCamelCase));

    return `${this.pathPrefix}${path}.${template.extension()}`;
  }

}
