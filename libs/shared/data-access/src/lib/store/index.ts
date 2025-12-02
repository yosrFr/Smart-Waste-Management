/* eslint-disable @nx/enforce-module-boundaries */
import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from './auth';
import * as fromEmployes from './employes';
import * as fromNotifications from './notifications';
import * as fromPointsCollecte from './points-de-collecte';
import * as fromTournees from './tournees';
import * as fromVehicules from './vehicules';

/**
 * Interface représentant l'état global de l'application
 */
export interface AppState {
  auth: fromAuth.AuthState;
  employes: fromEmployes.EmployeState;
  notifications: fromNotifications.NotificationState;
  pointsCollecte: fromPointsCollecte.PointCollecteState;
  tournees: fromTournees.TourneeState;
  vehicules: fromVehicules.VehiculeState;
}

/**
 * Map des reducers pour chaque slice du store
 */
export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  employes: fromEmployes.employeReducer,
  notifications: fromNotifications.notificationReducer,
  pointsCollecte: fromPointsCollecte.pointCollecteReducer,
  tournees: fromTournees.tourneeReducer,
  vehicules: fromVehicules.vehiculeReducer,
};

/**
 * Export de tous les effects
 */
export const effects = [
  fromAuth.AuthEffects,
  fromEmployes.EmployeEffects,
  fromNotifications.NotificationEffects,
  fromPointsCollecte.PointCollecteEffects,
  fromTournees.TourneeEffects,
  fromVehicules.VehiculeEffects,
];
