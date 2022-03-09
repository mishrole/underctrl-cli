import { NgModule } from '@angular/core';
import { LayoutModule } from './views/layout/layout.module';
import { SharedModule } from './views/pages/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  // declarations: [],
  imports: [
    SharedModule,
    LayoutModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
