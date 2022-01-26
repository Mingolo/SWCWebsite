import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfantryPageComponent } from './components/infantry-page.component';

const routes: Routes = [
  {
    path: 'infantry',
    component: InfantryPageComponent
  },  
  { path: '**', redirectTo: 'infantry' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulationRoutingModule { }
