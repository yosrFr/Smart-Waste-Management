/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { interval, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { GeoPoint } from '@smart-waste-management/shared/data-access';
import { updateTourneePosition } from '@smart-waste-management/shared/data-access';
import { calculateDistance, interpolatePoint } from './geo.helpers';

/**
 * Configuration pour une simulation GPS
 */
export interface GpsSimulationConfig {
  /** ID de la tournée */
  tourneeId: string;
  /** Points du circuit à suivre */
  waypoints: GeoPoint[];
  /** Vitesse en km/h (par défaut: 30 km/h) */
  speed?: number;
  /** Intervalle de mise à jour en ms (par défaut: 5000ms = 5s) */
  updateInterval?: number;
}

/**
 * État d'une simulation GPS
 */
interface SimulationState {
  tourneeId: string;
  waypoints: GeoPoint[];
  currentWaypointIndex: number;
  currentPosition: GeoPoint;
  progress: number; // 0 à 1 entre deux waypoints
  speed: number; // m/s
  updateInterval: number;
  stopSubject: Subject<void>;
}

/**
 * Service simulateur GPS
 * Simule le mouvement d'un véhicule le long d'un circuit
 */
@Injectable({
  providedIn: 'root',
})
export class GpsSimulatorService {
  private store = inject(Store);

  /**
   * Map des simulations en cours (tourneeId → state)
   */
  private simulations = new Map<string, SimulationState>();

  /**
   * Démarre une simulation GPS pour une tournée
   * @param config Configuration de la simulation
   * @returns Observable qui émet la position actuelle à chaque update
   */
  startSimulation(config: GpsSimulationConfig): Observable<GeoPoint> {
    // Arrête la simulation précédente si elle existe
    this.stopSimulation(config.tourneeId);

    // Valeurs par défaut
    const speed = (config.speed || 30) * (1000 / 3600); // Convertit km/h en m/s
    const updateInterval = config.updateInterval || 5000; // 5 secondes par défaut

    if (config.waypoints.length < 2) {
      throw new Error('Au moins 2 waypoints sont nécessaires');
    }

    const stopSubject = new Subject<void>();

    const state: SimulationState = {
      tourneeId: config.tourneeId,
      waypoints: config.waypoints,
      currentWaypointIndex: 0,
      currentPosition: config.waypoints[0],
      progress: 0,
      speed,
      updateInterval,
      stopSubject,
    };

    this.simulations.set(config.tourneeId, state);

    // Crée l'observable qui émet la position à intervalle régulier
    return interval(updateInterval).pipe(
      takeUntil(stopSubject),
      map(() => {
        const newPosition = this.updatePosition(state);

        // Dispatch l'action pour mettre à jour le store NgRx
        this.store.dispatch(
          updateTourneePosition({
            id: config.tourneeId,
            position: newPosition,
          })
        );

        return newPosition;
      })
    );
  }

  /**
   * Arrête une simulation GPS
   * @param tourneeId ID de la tournée
   */
  stopSimulation(tourneeId: string): void {
    const simulation = this.simulations.get(tourneeId);
    if (simulation) {
      simulation.stopSubject.next();
      simulation.stopSubject.complete();
      this.simulations.delete(tourneeId);
    }
  }

  /**
   * Arrête toutes les simulations en cours
   */
  stopAllSimulations(): void {
    this.simulations.forEach((_, tourneeId) => {
      this.stopSimulation(tourneeId);
    });
  }

  /**
   * Vérifie si une simulation est en cours
   * @param tourneeId ID de la tournée
   * @returns true si la simulation est active
   */
  isSimulationActive(tourneeId: string): boolean {
    return this.simulations.has(tourneeId);
  }

  /**
   * Met à jour la position dans une simulation
   * @param state État de la simulation
   * @returns Nouvelle position
   */
  private updatePosition(state: SimulationState): GeoPoint {
    const currentWaypoint = state.waypoints[state.currentWaypointIndex];
    const nextWaypointIndex = state.currentWaypointIndex + 1;

    // Si on a atteint le dernier waypoint, on boucle ou on s'arrête
    if (nextWaypointIndex >= state.waypoints.length) {
      // On reste au dernier point
      return state.waypoints[state.waypoints.length - 1];
    }

    const nextWaypoint = state.waypoints[nextWaypointIndex];

    // Calcule la distance entre les deux waypoints
    const totalDistance = calculateDistance(currentWaypoint, nextWaypoint);

    // Calcule la distance parcourue pendant cet intervalle
    const intervalInSeconds = state.updateInterval / 1000;
    const distanceTraveled = state.speed * intervalInSeconds;

    // Calcule le nouveau progrès
    const newProgress = state.progress + distanceTraveled / totalDistance;

    if (newProgress >= 1) {
      // On a atteint le prochain waypoint
      state.currentWaypointIndex = nextWaypointIndex;
      state.progress = 0;
      state.currentPosition = nextWaypoint;
      return nextWaypoint;
    } else {
      // On est entre deux waypoints
      state.progress = newProgress;
      state.currentPosition = interpolatePoint(
        currentWaypoint,
        nextWaypoint,
        newProgress
      );
      return state.currentPosition;
    }
  }

  /**
   * Récupère la position actuelle d'une simulation
   * @param tourneeId ID de la tournée
   * @returns Position actuelle ou null si pas de simulation
   */
  getCurrentPosition(tourneeId: string): GeoPoint | null {
    const simulation = this.simulations.get(tourneeId);
    return simulation ? simulation.currentPosition : null;
  }
}
