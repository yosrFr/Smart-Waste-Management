/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChangePasswordDto, LoginDto, LoginResponse } from '../models';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { AUTH_STORAGE_KEYS } from '../auth-constants/auth.constants';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../store/auth';

export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  roles: string[];
}

/**
 * Service d'authentification
 * Gère le login, logout et changement de mot de passe
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiAuth = '/auth';
  private http = inject(HttpClient);
  private store = inject(Store);

  private decodedToken?: JwtPayload;

  constructor() {
    this.restoreSession();
  }

  restoreSession() {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (this.isTokenExpired()) {
        this.logout(); // token réellement expiré
      } else {
        this.decodedToken = decoded;
        this.store.dispatch(
          loginSuccess({
            jwt: token,
            roles: decoded.roles,
            sub: decoded.sub,
          })
        );
      }
    } catch {
      this.logout(); // token corrompu
    }
  }

  /**
   * Connexion d'un utilisateur
   * @param credentials Email et mot de passe
   * @returns Observable avec le token et les infos utilisateur
   */
  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiAuth}/login`, credentials)
      .pipe(
        tap((res) => {
          if (!res?.token) {
            throw new Error('Token manquant dans la réponse');
          }
          this.setToken(res.token);
        })
      );
  }

  setToken(token: string): void {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    this.decodedToken = jwtDecode<JwtPayload>(token);
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    this.decodedToken = undefined;
  }

  isLoggedIn(): boolean {
    return !!this.decodedToken && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    if (!this.decodedToken) {
      return true; // No token available, considered expired
    }
    return this.decodedToken.exp * 1000 < Date.now();
  }

  getUserEmailFromToken(): string | null {
    return this.decodedToken?.sub ?? null;
  }

  getRolesFromToken(): string[] {
    return this.decodedToken?.roles ?? [];
  }

  /**
   * Change le mot de passe de l'utilisateur
   * @param dto Ancien et nouveau mot de passe
   * @returns Observable vide si succès
   */
  changePassword(dto: ChangePasswordDto): Observable<any> {
    return this.http.post(`${this.apiAuth}/change-password`, dto, {
      responseType: 'text',
    });
  }
}
