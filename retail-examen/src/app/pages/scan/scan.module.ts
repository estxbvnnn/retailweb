import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScanPage } from './scan.page';

const routes: Routes = [{ path: '', component: ScanPage }];

@NgModule({
  declarations: [ScanPage],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule, // <- necesario para [(ngModel)] en scan.page.html
    RouterModule.forChild(routes)
  ],
})
export class ScanPageModule {}
