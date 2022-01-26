import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SimulationRoutingModule } from './simulation-routing.module';
import { InfantryPageComponent } from './components/infantry-page.component';
import { ReactiveFormsModule } from '@angular/forms';

const COMPONENTS: any[] = [  
  InfantryPageComponent
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    SimulationRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class SimulationModule { }
