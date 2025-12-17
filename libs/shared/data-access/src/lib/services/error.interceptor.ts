/* eslint-disable @nx/enforce-module-boundaries */
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 && authService.isTokenExpired()) {
        authService.logout();
      }
      return throwError(() => err);
    })
  );
};
