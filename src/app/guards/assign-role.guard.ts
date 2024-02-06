import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate, RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { RolesService } from '../services/roles/roles.service';

@Injectable({
  providedIn: 'root',
})
export class AssignRoleGuard implements CanActivate, CanDeactivate<unknown> {
  constructor(private roleService: RolesService) {}
  canActivate(): Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((res) => {
      this.roleService.hasSignUpAccess().subscribe({
        next: (data: any) => {
          return res(true);
        },
        error: (error: HttpErrorResponse) => {
          return res(false);
        },
      });
    });
  }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((res) => {
      this.roleService.hasSignUpAccess().subscribe({
        next: (data: any) => {
          return res(false);
        },
        error: (error: HttpErrorResponse) => {
          return res(true);
        },
      });
    });
  }
}
