import { NgModule } from '@angular/core';
import { LayoutModule } from './views/layout/layout.module';
import { SharedModule } from './views/pages/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './views/pages/shared/error-page/error-page.component';
import { LayoutBaseComponent } from './views/layout/layout-base/layout-base.component';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  
  {
    path: '', component: LayoutBaseComponent, canActivate: [AuthGuard],
    children: [
      { path: 'home', loadChildren: () => import('./views/pages/home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] }
    ]
  },

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
