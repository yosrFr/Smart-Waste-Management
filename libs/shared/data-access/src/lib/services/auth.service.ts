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
      id: '1',
      nom: 'Admin',
      prenom: 'Principal',
      email: 'admin@waste.com',
      motDePasse: 'admin123',
      tel: '+216 20 123 456',
      dateNais: '1985-05-15',
      role: Role.ADMIN,
      actif: true,
    },
    {
      id: '2',
      nom: 'Ben Ali',
      prenom: 'Mohamed',
      email: 'employe@waste.com',
      motDePasse: 'employe123',
      tel: '+216 20 234 567',
      dateNais: '1990-03-20',
      role: Role.EMPLOYE,
      actif: true,
      disponibilite: Disponibilite.DISPONIBLE,
      numPermis: 'B123456',
    },
    {
      id: '3',
      nom: 'Trabelsi',
      prenom: 'Ahmed',
      email: 'ahmed@waste.com',
      motDePasse: 'ahmed123',
      tel: '+216 20 345 678',
      dateNais: '1988-07-10',
      role: Role.EMPLOYE,
      actif: true,
      disponibilite: Disponibilite.EN_MISSION,
      numPermis: 'B234567',
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

        if (!user.actif) {
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
