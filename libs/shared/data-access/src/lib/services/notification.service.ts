/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppNotification } from '../models';
import { HttpClient } from '@angular/common/http';

/**
 * Service pour gérer les notifications
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = '/api/notifications';

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les notifications
   * @returns Observable avec la liste des notifications triées par date
   */
  getAll(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.apiUrl}/all`);
  }
}
