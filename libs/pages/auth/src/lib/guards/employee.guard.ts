/* eslint-disable @nx/enforce-module-boundaries */
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectUserRole } from '@smart-waste-management/shared/data-access';

/**
 * Guard pour protéger les routes employé
 */
export const employeeGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectUserRole).pipe(
    take(1),
    map((role) => {
      if (role === 'EMPLOYE') {
        return true;
      }
      return router.createUrlTree(['/admin/dashboard']);
    })
  );
};
