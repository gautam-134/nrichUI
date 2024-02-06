import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoaderService } from '../loader.service';
import { TeacherService } from '../services/teacher/teacher.service';

@Injectable({
  providedIn: 'root',
})
export class StudentProfileGuard
  implements CanActivate, CanDeactivate<unknown>
{
  constructor(
    private teacherService: TeacherService,
    private loader: LoaderService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve) => {
      if (!localStorage.getItem('auth')) return resolve(true);
      this.loader
        .showLoader(this.teacherService.isStudentProfileCompleted())
        .subscribe({
          next: () => {
            return resolve(false);
          },
          error: (error: HttpErrorResponse) => {
            return resolve(true);
          },
        });
    });
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve) => {
      if (!localStorage.getItem('auth')) return resolve(true);
      this.teacherService.isStudentProfileCompleted().subscribe({
        next: () => {
          return resolve(true);
        },
        error: (error: HttpErrorResponse) => {
          return resolve(false);
        },
      });
    });
  }
}
