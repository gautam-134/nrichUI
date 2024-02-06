import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { LoaderService } from '../loader.service';
import { AuthService } from '../services/auth.service';
import { RolesService } from '../services/roles/roles.service';

@Injectable({
  providedIn: 'root',
})
export class ModuleGuardGuard implements CanLoad {
  constructor(
    private roleService: RolesService,
    private loader: LoaderService,
    private router: Router
  ) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((res) => {
      this.loader
        .showLoader(
          this.roleService.hasModuleAccess(
            route.data?.['id'],
            +AuthService.getInstituteId
          )
        )
        .subscribe({
          next: (data: any) => {
            return res(true);
          },
          error: (error: HttpErrorResponse) => {
            this.router.navigate(['/error']);
            return res(false);
          },
        });
    });
  }
}
