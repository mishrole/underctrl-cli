import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutBaseComponent } from './layout-base/layout-base.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    LayoutBaseComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class LayoutModule { }
