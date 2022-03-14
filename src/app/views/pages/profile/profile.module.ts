import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileChangepasswordComponent } from './profile-changepassword/profile-changepassword.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        component: ProfileEditComponent
      },
      {
        path: 'changepassword',
        component: ProfileChangepasswordComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileEditComponent,
    ProfileChangepasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ProfileModule { }
