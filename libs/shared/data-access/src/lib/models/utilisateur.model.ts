import { Disponibilite, Role } from '../enums';

/**
 * Modèle de base pour un utilisateur
 */
export interface Utilisateur {
  id: string;
  /** Nom de famille */
  nom: string;
  prenom: string;
  email: string;
  /** Numèro de téléphone */
  tel: string;
  /** Date de naissance */
  dateNais: string;
  /** Indique si l'emplyé travaille encore dans le société */
  active: boolean;
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

  tourneeIds?: string[];
}

/**
 * DTO pour la création d'un utilisateur
 */
export interface CreateUtilisateurDto {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  tel: string;
  dateNais: string;
  role: Role;
  active: boolean;
  // Pour employés seulement
  disponibilite?: Disponibilite;
  numPermis?: string;
  tourneesIds?: string[];
}

/**
 * DTO pour la modification d'un utilisateur
 */
export interface UpdateUtilisateurDto {
  role: Role;
  email: string;
  tel: string;
  // Pour employés seulement
  numPermis?: string;
}

/**
 * DTO pour la modification du profil
 */
export interface UpdateProfilEmployeDto {
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  dateNaissance: string;
}
