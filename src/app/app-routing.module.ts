import { NgModule } from '@angular/core';
import { LayoutModule } from './views/layout/layout.module';
import { SharedModule } from './views/pages/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './views/pages/shared/error-page/error-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
    
  {
    path: 'error', component: ErrorPageComponent, data: {
      type: 404,
      title: 'Page Not Found',
      desc: 'The page you were looking for doesn\'t exist.'
    }
  },
  { path : 'error/:type', component: ErrorPageComponent },
  { path: '**', redirectTo: 'error', pathMatch: 'full'}
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
