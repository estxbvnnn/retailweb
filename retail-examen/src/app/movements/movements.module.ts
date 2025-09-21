import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { MovementsPage } from './movements.page';

const routes: Routes = [{ path: '', component: MovementsPage }];

@NgModule({
  declarations: [MovementsPage],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
})
export class MovementsPageModule {}
