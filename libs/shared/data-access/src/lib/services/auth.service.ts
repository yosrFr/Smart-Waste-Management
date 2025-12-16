/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LoginDto,
  LoginResponse,
  ChangePasswordDto,
  Utilisateur,
  Employe,
  Administrateur,
} from '../models';
import { Role, Disponibilite } from '../enums';

/**
 * Service d'authentification
 * Gère le login, logout et changement de mot de passe
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Utilisateurs mockés pour la démo
   */
  private mockUsers: (Employe | Administrateur)[] = [
    {
      id: 'admin002',
      nom: 'Hamdi',
      prenom: 'Sonia',
      email: 'sonia.hamdi@transport.tn',
      motDePasse: 'ADMIN123',
      tel: '+216 99 876 543',
      dateNais: '1983-09-12',
      role: Role.ADMIN,
      active: true,
    },
    {
      id: 'emp004',
      nom: 'Sassi',
      prenom: 'Leila',
      email: 'leila.sassi@transport.tn',
      motDePasse: 'EMPLOYE123',
      tel: '+216 26 456 789',
      dateNais: '1995-05-17',
      role: Role.EMPLOYE,
      active: true,
      disponibilite: Disponibilite.DISPONIBLE,
      numPermis: 'TN4567890',
      tourneeIds: ['693f0862dee7a71746b7fa55'],
    },
  ];

  /**
   * Connexion d'un utilisateur
   * @param credentials Email et mot de passe
   * @returns Observable avec le token et les infos utilisateur
   */
  login(credentials: LoginDto): Observable<LoginResponse> {
    return of(null).pipe(
      map(() => {
        const user = this.mockUsers.find(
          (u) =>
            u.email === credentials.email &&
            u.motDePasse === credentials.motDePasse
        );

        if (!user) {
          throw new Error('Email ou mot de passe incorrect');
        }

        if (!user.active) {
          throw new Error('Compte désactivé');
        }

        // Génère un token JWT mocké
        const token = btoa(
          JSON.stringify({ userId: user.id, role: user.role })
        );

        return {
          token,
          user,
        };
      })
    );
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  /**
   * Change le mot de passe de l'utilisateur
   * @param dto Ancien et nouveau mot de passe
   * @returns Observable vide si succès
   */
  changePassword(dto: ChangePasswordDto): Observable<void> {
    return of(null).pipe(
      map(() => {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
          throw new Error('Utilisateur non connecté');
        }

        const user = this.mockUsers.find((u) => u.id === currentUser.id);
        if (!user) {
          throw new Error('Utilisateur introuvable');
        }

        if (user.motDePasse !== dto.ancienMotDePasse) {
          throw new Error("L'ancien mot de passe est incorrect");
        }

        // Met à jour le mot de passe
        user.motDePasse = dto.nouveauMotDePasse;
        return;
      })
    );
  }

  /**
   * Récupère l'utilisateur actuellement connecté depuis le localStorage
   * @returns Utilisateur connecté ou null
   */
  getCurrentUser(): Utilisateur | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Vérifie si un token est valide
   * @param token Token JWT à vérifier
   * @returns true si valide, false sinon
   */
  isTokenValid(token: string): boolean {
    try {
      const decoded = JSON.parse(atob(token));
      return !!decoded.userId;
    } catch {
      return false;
    }
  }
}
