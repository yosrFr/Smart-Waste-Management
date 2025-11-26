/**
 * Statistiques pour le dashboard admin
 */
export interface DashboardAdminStats {
  /** Nombre total de points de collecte */
  totalPointsCollecte: number;
  /** Nombre de points pleins */
  pointsCollectePleins: number;
  /** Nombre de points endommagés */
  pointsCollecteEndommages: number;
  /** Nombre de véhicules disponibles */
  vehiculesDisponibles: number;
  /** Nombre de véhicules en réparation */
  vehiculesEnReparation: number;
  /** Nombre de véhicules en mission */
  vehiculesEnMission: number;
  /** Nombre de tournées en cours aujourd'hui */
  tourneesEnCoursAujourdhui: number;
  /** Nombre de tournées terminées aujourd'hui */
  tourneesTermineesAujourdhui: number;
  /** Nombre de tournées non commencées aujourd'hui */
  tourneesNonCommenceesAujourdhui: number;
}

/**
 * Statistiques pour le dashboard employé
 */
export interface DashboardEmployeStats {
  /** Nombre de tournées du jour */
  tourneesAujourdhui: number;
  /** Nombre de tournées terminées */
  tourneesTerminees: number;
}