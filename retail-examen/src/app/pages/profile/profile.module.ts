import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';

const routes: Routes = [{ path: '', component: ProfilePage }];

@NgModule({
  declarations: [ProfilePage],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule.forChild(routes)],
})
export class ProfilePageModule {}
