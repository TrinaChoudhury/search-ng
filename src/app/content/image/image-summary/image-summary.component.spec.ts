import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSummaryComponent } from './image-summary.component';

describe('ImageSummaryComponent', () => {
  let component: ImageSummaryComponent;
  let fixture: ComponentFixture<ImageSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
