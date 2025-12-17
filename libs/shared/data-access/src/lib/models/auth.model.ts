/**
 * DTO pour la connexion
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Réponse de l'API après une connexion réussie
 */
export interface LoginResponse {
  /** Token JWT */
  token: string;
}

/**
 * DTO pour changer le mot de passe
 */
export interface ChangePasswordDto {
  /** Ancien mot de passe */
  oldPassword: string;
  /** Nouveau mot de passe */
  newPassword: string;
}
