/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardAdminStats, DashboardEmployeStats } from '../models';
import { PointCollecteService } from './point-de-collecte.service';
import { VehiculeService } from './vehicule.service';
import { TourneeService } from './tournee.service';

/**
 * Service pour récupérer les statistiques des dashboards
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private pointCollecteService = inject(PointCollecteService);
  private vehiculeService = inject(VehiculeService);
  private tourneeService = inject(TourneeService);

  /**
   * Récupère les statistiques pour le dashboard admin
   * @returns Observable avec les statistiques
   */
  getAdminStats(): Observable<DashboardAdminStats> {
    const stats: DashboardAdminStats = {
      totalPointsCollecte: 25,
      pointsCollectePleins: 3,
      pointsCollecteEndommages: 2,
      vehiculesDisponibles: 8,
      vehiculesEnReparation: 2,
      vehiculesEnMission: 3,
      tourneesEnCoursAujourdhui: 5,
      tourneesTermineesAujourdhui: 12,
      tourneesNonCommenceesAujourdhui: 8,
    };

    return of(stats);
  }

  /**
   * Récupère les statistiques pour le dashboard employé
   * @param employeId ID de l'employé
   * @returns Observable avec les statistiques
   */
  getEmployeStats(employeId: string): Observable<DashboardEmployeStats> {
    // Calcule les stats pour cet employé
    const stats: DashboardEmployeStats = {
      tourneesAujourdhui: 2,
      tourneesTerminees: 15,
    };

    return of(stats);
  }
}
