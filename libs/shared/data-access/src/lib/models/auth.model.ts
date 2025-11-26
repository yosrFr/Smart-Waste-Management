import { Administrateur, Employe } from "./utilisateur.model";

/**
 * DTO pour la connexion
 */
export interface LoginDto {
  email: string;
  motDePasse: string;
}

/**
 * Réponse de l'API après une connexion réussie
 */
export interface LoginResponse {
  /** Token JWT */
  token: string;
  /** Informations de l'utilisateur connecté */
  user: Employe | Administrateur;
}

/**
 * DTO pour changer le mot de passe
 */
export interface ChangePasswordDto {
  /** Ancien mot de passe */
  ancienMotDePasse: string;
  /** Nouveau mot de passe */
  nouveauMotDePasse: string;
}