/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';

/**
 * Service helper pour gérer le localStorage de manière typée
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Sauvegarde une valeur dans le localStorage
   * @param key Clé
   * @param value Valeur (sera stringifiée en JSON)
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  /**
   * Récupère une valeur du localStorage
   * @param key Clé
   * @returns La valeur parsée ou null
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  }

  /**
   * Supprime une valeur du localStorage
   * @param key Clé
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }

  /**
   * Vide complètement le localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  /**
   * Vérifie si une clé existe
   * @param key Clé
   * @returns true si la clé existe
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
