import {Component, OnInit} from '@angular/core';
import {ModelsService} from '../../services/models.service';

@Component({
  selector: 'app-loader-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  /**
   * @type {boolean}
   */
  success = false;

  /**
   * Constructor
   */
  constructor(private modelsService: ModelsService) {
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.success = false;
  }

  /**
   * Triggered when a new file is selected
   *
   * @param {Event} event
   */
  onFileChange(event: Event) {
    
    this.success = false;

    const target: any = event.target;
    const files: FileList = target.files;

    if (files.length === 0) {
      return;
    }

    const file: File = files[0];
    const reader: FileReader = new FileReader();

    reader.onloadend = () => {
      this.modelsService.loadFromContent(reader.result)
        .then(() => {
          this.success = true;
        });
    };
    reader.readAsText(file);
  }

}
