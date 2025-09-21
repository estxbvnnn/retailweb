import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AwsPage } from './aws.page';

const routes: Routes = [{ path: '', component: AwsPage }];

@NgModule({
  declarations: [AwsPage],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule.forChild(routes)],
})
export class AwsPageModule {}
