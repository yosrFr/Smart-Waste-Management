import { Disponibilite, Role } from "../enums";

/**
 * Modèle de base pour un utilisateur
 */
export interface Utilisateur {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    /** Date de naissance */
    dateNais: string;
    /** Indique si l'emplyé travaille encore dans le société */
    actif: boolean;
    /** Mot de passe hashé */
    motDePasse: string;
    /** 
     * Role de l'emplyé dans la société
     * Il peut être un administrateur ou un employé
     */
    role: Role;
}

/**
 * Modèle pour un administrateur
 * Hérite de Utilisateur
 */
export interface Administrateur extends Utilisateur {
    role: Role.ADMIN;
}

/**
 * Modèle pour un employé
 * Hérite de Utilisateur
 */
export interface Employe extends Utilisateur {
    role: Role.EMPLOYE;
    /** Disponibilité actuelle de l'employé */
    disponibilite: Disponibilite;
    /** Numéro de permis de conduire */
    numPermis: string;
}
