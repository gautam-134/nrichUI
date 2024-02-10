import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Router } from '@angular/router';
  import { Observable, tap } from 'rxjs';
  import { ApiResponse } from '../model/ApiResponse';
  import { SwalAlertService } from '../services/alert/swal-alert.service';
  import { AuthService } from '../services/auth.service';
  
  @Injectable()
  export class SingleLoginInterceptor implements HttpInterceptor {
    constructor(
      private authService: AuthService,
      private router: Router,
      private alertService: SwalAlertService
    ) {}
  
    intercept(
      request: HttpRequest<unknown>,
      next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
      if (this.authService.getSingleLoginValidateToken) {
        request = request.clone({
          headers: request.headers
            .set('loginToken', this.authService.getSingleLoginValidateToken)
            .set('Cross-Origin-Embedder-Policy', ['require-corp', 'always'])
            .set('Cross-Origin-Opener-Policy', ['same-origin', 'always']),
        });
      }
      return next.handle(request).pipe(
        tap((response) => {
          if (response instanceof HttpResponse) {
            if ((response.body as ApiResponse).status == 401) {
              this.alertService.errorAlert(
                'Someone else is logged in your account'
              );
              this.router.navigateByUrl('/login');
              localStorage.clear();
            }
          }
        })
      );
    }
  }
  