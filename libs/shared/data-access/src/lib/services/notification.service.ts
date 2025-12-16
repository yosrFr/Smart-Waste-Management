/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiNotification } from '../models';
import { HttpClient } from '@angular/common/http';

/**
 * Service pour gérer les notifications
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = '/api/notifications';

  private http = inject(HttpClient);

  /**
   * Récupère toutes les notifications
   * @returns Observable avec la liste des notifications triées par date
   */
  getAll(): Observable<ApiNotification[]> {
    return this.http.get<ApiNotification[]>(`${this.apiUrl}/all`).pipe(
      tap((response) => {
        // console.log("Réponse de l'API:", response);
      })
    );
  }
}
