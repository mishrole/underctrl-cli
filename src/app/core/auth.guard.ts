import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const session = this.authService.getSession();
    const menuItems = this.authService.loadMenuItems(session?.user);
    const hasAccessTo = (url: any) => menuItems?.find(menuAccess => url.includes(menuAccess.url));

    if (session && session.authenticated && hasAccessTo(state.url)) {
      return true;
    } else {
      if(session && session.authenticated) {
        this.router.navigate(['/home']);
        return true;
      }
    }

    this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;

  }

}
