import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {IPreset} from '../../interfaces/preset';

@Component({
  selector: 'app-preset-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  /**
   * Constructor
   * @param {StorageService} storageService
   */
  constructor(private storageService: StorageService) {
  }

  /**
   * Preset instances
   *
   * @type {IPreset[]}
   */
  public presets: IPreset[];

  /**
   * @inheritDoc
   */
  ngOnInit() {
    this.updatePresets();
  }

  /**
   * Called when the user apply the preset
   */
  applyPreset(preset: IPreset): void {
    // Store the preset
    this.storageService.remove(preset)
      .then(() => this.updatePresets());
  }

  /**
   * Update presets with storage
   *
   * @returns {Promise<void>}
   */
  protected async updatePresets(): Promise<void> {
    this.presets = await this.storageService.list();
  }

}
