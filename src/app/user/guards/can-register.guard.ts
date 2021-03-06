import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '@cyberbook/core/services/user.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { getLocalStorageValueByKey } from '../../shared/utils/get-localstorage-value-by-key';

@Injectable()
export class CanRegisterGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userId: null | string = getLocalStorageValueByKey('userId');

    if (!userId) {
      return of(true);
    }

    return this.userService.loginWithToken().pipe(
      switchMap(user => {
        if (user.registered) {
          this.router.navigate(['/user']);
          return of(false);
        } else {
          return of(true);
        }
      }),
      catchError(e => {
        return of(true);
      })
    );
  }
}
