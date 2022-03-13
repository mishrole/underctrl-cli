import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsAddComponent } from './accounts-add/accounts-add.component';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountsDetailsComponent } from './accounts-details/accounts-details.component';
import { AccountsEditComponent } from './accounts-edit/accounts-edit.component';
import { AccountsListComponent } from './accounts-list/accounts-list.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    children: [
      {
        path: '',
        component: AccountsListComponent
      },
      {
        path: 'new',
        component: AccountsAddComponent
      },
      {
        path: ':id/detail',
        component: AccountsDetailsComponent
      },
      {
        path: ':id/edit',
        component: AccountsEditComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    AccountsComponent,
    AccountsAddComponent,
    AccountsDetailsComponent,
    AccountsEditComponent,
    AccountsListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountsModule { }
