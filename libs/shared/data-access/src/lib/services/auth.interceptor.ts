/* eslint-disable @nx/enforce-module-boundaries */
import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Intercepteur HTTP fonctionnel (Angular 20)
 * Ajoute le token JWT à chaque requête HTTP
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    // Clone la requête et ajoute le header Authorization
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
