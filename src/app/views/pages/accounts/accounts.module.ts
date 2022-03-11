import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsAddComponent } from './accounts-add/accounts-add.component';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountsDetailsComponent } from './accounts-details/accounts-details.component';

const routes: Routes = [
  {
    path: '', component: AccountsComponent,
    children: [
      {
        path: 'new', component: AccountsAddComponent
      },
      {
        path: ':id/detail',
        component: AccountsDetailsComponent
      },
    ]
  }
];

@NgModule({
  declarations: [
    AccountsComponent,
    AccountsAddComponent,
    AccountsDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountsModule { }
