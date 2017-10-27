import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelNewComponent } from './model-new.component';

describe('ModelNewComponent', () => {
  let component: ModelNewComponent;
  let fixture: ComponentFixture<ModelNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
