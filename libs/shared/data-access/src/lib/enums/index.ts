/**
 * Rôle d'un utilisateur dans le système
 */
export enum Role {
    ADMIN = 'ADMIN',
    EMPLOYE = 'EMPLOYE'
}

/**
 * Statut d'un véhicule 
 */
export enum StatutVehicule {
    ACTIF = 'ACTIF',
    INACTIF = 'INACTIF',
    EN_REPARATION = 'EN_REPARTION',
    EN_MISSION = 'EN_MISSION'
}

/**
 * Type de déchet collecté
 */
export enum TypeDechet {
    PLASTIQUE = 'PLASTIQUE',
    METAUX = 'METAUX',
    ALIMENTAIRE = 'ALIMENTAIRE',
    AUTRE = 'AUTRE',
    VERRE = 'VERRE'
}

/**
 * Etat d'un conteneur / point de collecte
 */
export enum EtatConteneur {
    NORMAL = 'NORMAL',
    ENDOMMAGE = 'ENDOMMAGE',
    PLEIN = 'PLEIN'
}

/**
 * Statut d'une tournée
 */
export enum StatutTournee {
    NON_COMMENCEE = 'NON_COMMENCEE',
    EN_COURS = 'EN_COURS',
    TERMINEE = 'TERMINEE'
}

/**
 * Disponibilité d'un employé
 */
export enum Disponibilite {
    DISPONIBLE = 'DISPONIBLE',
    EN_MISSION = 'EN_MISSION'
}

/**
 * Type de notification
 */
export enum TypeNotif {
    ENDOMMAGE = 'ENDOMMAGE',
    PANNE = 'PANNE',
    INCIDENT = 'INCIDENT',
    PLEIN = 'PLEIN',
    NOUVELLE_TACHE = 'NOUVELLE_TACHE'
}