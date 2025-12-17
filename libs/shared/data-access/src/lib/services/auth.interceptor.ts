/* eslint-disable @nx/enforce-module-boundaries */
import { HttpInterceptorFn } from '@angular/common/http';
import { AUTH_STORAGE_KEYS } from '../auth-constants/auth.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);

  if (token) {
    return next(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
  }

  return next(req);
};
