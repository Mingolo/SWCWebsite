import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfantryPageComponent } from './infantry-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { SimulationRoutingModule } from '../simulation-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('InfantryPageComponent', () => {
  let component: InfantryPageComponent;
  let fixture: ComponentFixture<InfantryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        SimulationRoutingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      declarations: [ InfantryPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfantryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
