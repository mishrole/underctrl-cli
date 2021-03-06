import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordsComponent } from './records.component';
import { RecordsAddComponent } from './records-add/records-add.component';
import { RecordsDetailsComponent } from './records-details/records-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RecordsEditComponent } from './records-edit/records-edit.component';
import { RecordsListComponent } from './records-list/records-list.component';

const routes: Routes = [
  {
    path: '',
    component: RecordsComponent,
    children: [
      {
        path: '',
        component: RecordsListComponent
      },
      {
        path: 'new',
        component: RecordsAddComponent
      },
      {
        path: ':id/detail',
        component: RecordsDetailsComponent
      },
      {
        path: ':id/edit',
        component: RecordsEditComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    RecordsComponent,
    RecordsAddComponent,
    RecordsDetailsComponent,
    RecordsEditComponent,
    RecordsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class RecordsModule { }
