/**
 * Rôle d'un utilisateur dans le système
 */
export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYE = 'EMPLOYE',
}

/**
 * Statut d'un véhicule
 */
export enum StatutVehicule {
  // Véhicule opérationnel et disponible pour des missions
  ACTIF = 'ACTIF',
  // Véhicule n'existe plus dans le garage
  INACTIF = 'INACTIF',
  // Véhicule en cours de réparation
  EN_REPARATION = 'EN_REPARTION',
  // Véhicule actuellement en mission
  EN_MISSION = 'EN_MISSION',
}

/**
 * Type de déchet collecté
 */
export enum TypeDechet {
  PLASTIQUE = 'PLASTIQUE',
  METAUX = 'METAUX',
  ALIMENTAIRE = 'ALIMENTAIRE',
  AUTRE = 'AUTRE',
  VERRE = 'VERRE',
}

/**
 * Etat d'un conteneur / point de collecte
 */
export enum EtatConteneur {
  // Conteneur en état normal
  NORMAL = 'NORMAL',
  // Conteneur endommagé
  ENDOMMAGE = 'ENDOMMAGE',
  // Conteneur plein
  PLEIN = 'PLEIN',
  // Conteneur supprimé
  SUPPRIME = 'SUPPRIME',
}

/**
 * Statut d'une tournée
 */
export enum StatutTournee {
  // Tournée planifiée mais non commencée
  NON_COMMENCEE = 'NON_COMMENCEE',
  // Tournée en cours
  EN_COURS = 'EN_COURS',
  // Tournée terminée
  TERMINEE = 'TERMINEE',
}

/**
 * Disponibilité d'un employé
 */
export enum Disponibilite {
  // Disponible pour une nouvelle tâche
  DISPONIBLE = 'DISPONIBLE',
  // Actuellement occupé avec une tâche
  EN_MISSION = 'EN_MISSION',
}

/**
 * Type de notification
 */
export enum TypeNotif {
  // Un conteneur est endommagé
  ENDOMMAGE = 'ENDOMMAGE',
  // Une véhicule est en panne
  PANNE = 'PANNE',
  // Un incident a été signalé
  INCIDENT = 'INCIDENT',
  // Un conteneur est plein
  PLEIN = 'PLEIN',
  // Nouvelle tâche assignée à un employé
  NOUVELLE_TACHE = 'NOUVELLE_TACHE',
}
