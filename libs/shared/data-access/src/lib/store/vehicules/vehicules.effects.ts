/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as VehiculesActions from './vehicules.actions';
import { VehiculeService } from '../../services/vehicule.service';

@Injectable()
export class VehiculeEffects {
  private actions$ = inject(Actions);
  private vehiculeService = inject(VehiculeService);

  loadVehicules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiculesActions.loadVehicules),
      switchMap(() =>
        this.vehiculeService.getAll().pipe(
          map((vehicules) =>
            VehiculesActions.loadVehiculesSuccess({ vehicules })
          ),
          catchError((error) =>
            of(VehiculesActions.loadVehiculesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createVehicule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiculesActions.createVehicule),
      switchMap(({ dto }) =>
        this.vehiculeService.create(dto).pipe(
          map((vehicule) =>
            VehiculesActions.createVehiculeSuccess({ vehicule })
          ),
          catchError((error) =>
            of(VehiculesActions.loadVehiculesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateVehicule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiculesActions.updateVehicule),
      switchMap(({ id, dto }) =>
        this.vehiculeService.update(id, dto).pipe(
          map((vehicule) =>
            VehiculesActions.updateVehiculeSuccess({ vehicule })
          ),
          catchError((error) =>
            of(VehiculesActions.loadVehiculesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteVehicule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiculesActions.deleteVehicule),
      switchMap(({ id }) =>
        this.vehiculeService.delete(id).pipe(
          map(() => VehiculesActions.deleteVehiculeSuccess({ id })),
          catchError((error) =>
            of(VehiculesActions.loadVehiculesFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
