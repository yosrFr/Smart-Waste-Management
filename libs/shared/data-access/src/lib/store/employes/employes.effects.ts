/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as EmployesActions from './employes.actions';
import { EmployeService } from '../../services/employe.service';

/**
 * Effects pour la gestion des employés
 */
@Injectable()
export class EmployeEffects {
  private actions$ = inject(Actions);
  private employeService = inject(EmployeService);

  /**
   * Effect pour le chargement des employés
   */
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

  /**
   * Effect pour la création d'un employé
   */
  createEmploye$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployesActions.createEmploye),
      switchMap(({ dto }) =>
        this.employeService.create(dto).pipe(
          map((employe) => EmployesActions.createEmployeSuccess({ employe })),
          catchError((error) =>
            of(EmployesActions.createEmployeFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Effect pour la mise à jour d'un employé par un admin
   */
  updateEmployeByAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployesActions.updateEmployeByAdmin),
      switchMap(({ id, dto }) =>
        this.employeService.updateByAdmin(id, dto).pipe(
          map((employe) =>
            EmployesActions.updateEmployeByAdminSuccess({ employe })
          ),
          catchError((error) =>
            of(
              EmployesActions.updateEmployeByAdminFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  /**
   * Effect pour la mise à jour du profil d'un employé
   */
  updateProfilEmploye$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployesActions.updateProfilEmploye),
      switchMap(({ id, dto }) =>
        this.employeService.updateProfil(id, dto).pipe(
          map((employe) =>
            EmployesActions.updateProfilEmployeSuccess({ employe })
          ),
          catchError((error) =>
            of(
              EmployesActions.updateProfilEmployeFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  /**
   * Effect pour la suppression d'un employé
   */
  deleteEmploye$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployesActions.deleteEmploye),
      switchMap(({ id }) =>
        this.employeService.delete(id).pipe(
          map(() => EmployesActions.deleteEmployeSuccess({ id })),
          catchError((error) =>
            of(EmployesActions.deleteEmployeFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
