import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-model-new',
  templateUrl: './model-new.component.html',
  styleUrls: ['./model-new.component.scss']
})
export class ModelNewComponent implements OnInit {

  constructor() { }

  public model: any = {
    name: 'user',
    fields: [
      {
        name: 'id'
      },
      {
        name: 'first name'
      },
      {
        name: 'last name'
      }
    ]
  };

  ngOnInit() {
  }

}
