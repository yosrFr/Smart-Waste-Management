/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Types de thème disponibles
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Service de gestion du thème de l'application
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private themeSubject = new BehaviorSubject<ThemeMode>('light');

  /**
   * Observable du thème actuel
   */
  theme$: Observable<ThemeMode> = this.themeSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  /**
   * Initialise le thème depuis le localStorage ou détecte le thème système
   */
  private initTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as ThemeMode;
    const theme = savedTheme || this.detectSystemTheme();
    this.setTheme(theme);
  }

  /**
   * Détecte le thème système de l'utilisateur
   */
  private detectSystemTheme(): ThemeMode {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Change le thème de l'application
   * @param theme Thème à appliquer
   */
  setTheme(theme: ThemeMode): void {
    let effectiveTheme = theme;

    if (theme === 'auto') {
      effectiveTheme = this.detectSystemTheme();
    }

    // Applique la classe sur le body
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${effectiveTheme}-theme`);

    // Sauvegarde dans localStorage
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSubject.next(theme);
  }

  /**
   * Retourne le thème actuel
   */
  getCurrentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  /**
   * Toggle entre light et dark
   */
  toggleTheme(): void {
    const current = this.getCurrentTheme();
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }
}
