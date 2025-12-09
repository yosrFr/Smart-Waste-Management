/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardAdminStats, DashboardEmployeStats } from '../models';
import {
  selectAllPointsCollecte,
  selectPointsCollecteByEtat,
} from '../store/points-de-collecte';
import { selectVehiculesByStatut } from '../store/vehicules';
import {
  selectTourneesAujourdhuiByEmployeId,
  selectTourneesAujourdhuiByEmployeIdAndStatut,
  selectTourneesAujourdhuiByStatut,
} from '../store/tournees';
import { EtatConteneur, StatutTournee, StatutVehicule } from '../enums';

/**
 * Service pour récupérer les statistiques des dashboards
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  /**
   * Récupère les statistiques pour le dashboard admin
   * @returns Observable avec les statistiques
   */
  getAdminStats(): Observable<DashboardAdminStats> {
    const stats: DashboardAdminStats = {
      totalPointsCollecte: selectAllPointsCollecte.length,
      pointsCollectePleins: selectPointsCollecteByEtat(EtatConteneur.PLEIN)
        .length,
      pointsCollecteEndommages: selectPointsCollecteByEtat(
        EtatConteneur.ENDOMMAGE
      ).length,
      vehiculesDisponibles: selectVehiculesByStatut(StatutVehicule.ACTIF)
        .length,
      vehiculesEnReparation: selectVehiculesByStatut(
        StatutVehicule.EN_REPARATION
      ).length,
      vehiculesEnMission: selectVehiculesByStatut(StatutVehicule.EN_MISSION)
        .length,
      tourneesEnCoursAujourdhui: selectTourneesAujourdhuiByStatut(
        StatutTournee.EN_COURS
      ).length,
      tourneesTermineesAujourdhui: selectTourneesAujourdhuiByStatut(
        StatutTournee.TERMINEE
      ).length,
      tourneesNonCommenceesAujourdhui: selectTourneesAujourdhuiByStatut(
        StatutTournee.NON_COMMENCEE
      ).length,
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
      tourneesAujourdhui: selectTourneesAujourdhuiByEmployeId(employeId).length,
      tourneesTerminees: selectTourneesAujourdhuiByEmployeIdAndStatut(
        employeId,
        StatutTournee.TERMINEE
      ).length,
    };

    return of(stats);
  }
}
