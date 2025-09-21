import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RetailPage } from './retail.page';

const routes: Routes = [{ path: '', component: RetailPage }];

@NgModule({
  declarations: [RetailPage],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule.forChild(routes)],
})
export class RetailPageModule {}
