import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingPageSpinnerComponent } from './loading-page-spinner.component';

describe('LoadingPageSpinnerComponent', () => {
  let component: LoadingPageSpinnerComponent;
  let fixture: ComponentFixture<LoadingPageSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingPageSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingPageSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
