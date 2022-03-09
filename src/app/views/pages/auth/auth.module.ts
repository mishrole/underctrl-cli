import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

const routes: Routes = [
  {
    path: '', component: AuthComponent,
    children: [
      {
        path: '', component: LoginComponent
      },
      { 
        path: 'signup', component: RegisterComponent
      },
      { 
        path: 'forgot-password', component: ForgotPasswordComponent
      },
      { 
        path: 'recover-password', component: RecoverPasswordComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    AuthComponent,// OMG, IMPORTANT TO USE ROUTER-OUTLET ON AUTH COMPONENT HTML
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent 
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class AuthModule { }
