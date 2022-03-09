import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';

const routes: Routes = [
  {
    path: '', component: AuthComponent,
    children: [
      {
        path: '', component: LoginComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    AuthComponent,// OMG, IMPORTANT TO USE ROUTER-OUTLET ON AUTH COMPONENT HTML
    LoginComponent 
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class AuthModule { }
