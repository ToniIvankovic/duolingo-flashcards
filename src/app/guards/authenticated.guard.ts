import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { delay, map, Observable, of, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private readonly router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
            let user = of(this.authService.getCurrentUser());
            return user.pipe(
                map(u => {
                    if(u){
                        return true;
                    }
                    return this.router.createUrlTree(['/login']);
                })
            )
    }
}
