import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { MapPage } from './map.page';

const routes: Routes = [{ path: '', component: MapPage }];

@NgModule({
  declarations: [MapPage],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
})
export class MapPageModule {}