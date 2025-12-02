/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as EmployesActions from './employes.actions';
import { EmployeService } from '../../services/employe.service';

@Injectable()
export class EmployeEffects {
  private actions$ = inject(Actions);
  private employeService = inject(EmployeService);

  loadEmployes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployesActions.loadEmployes),
      switchMap(() =>
        this.employeService.getAll().pipe(
          map((employes) => EmployesActions.loadEmployesSuccess({ employes })),
          catchError((error) =>
            of(EmployesActions.loadEmployesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createEmploye$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployesActions.createEmploye),
      switchMap(({ dto }) =>
        this.employeService.create(dto).pipe(
          map((employe) => EmployesActions.createEmployeSuccess({ employe })),
          catchError((error) =>
            of(EmployesActions.loadEmployesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateEmploye$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployesActions.updateEmploye),
      switchMap(({ id, dto }) =>
        this.employeService.update(id, dto).pipe(
          map((employe) => EmployesActions.updateEmployeSuccess({ employe })),
          catchError((error) =>
            of(EmployesActions.loadEmployesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteEmploye$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployesActions.deleteEmploye),
      switchMap(({ id }) =>
        this.employeService.delete(id).pipe(
          map(() => EmployesActions.deleteEmployeSuccess({ id })),
          catchError((error) =>
            of(EmployesActions.loadEmployesFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
