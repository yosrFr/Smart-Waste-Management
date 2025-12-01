/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  PointDeCollecte,
  CreatePointCollecteDto,
  UpdatePointCollecteDto,
} from '../models';
import { EtatConteneur, TypeDechet } from '../enums';

/**
 * Service pour gérer les points de collecte
 */
@Injectable({
  providedIn: 'root',
})
export class PointCollecteService {
  /**
   * Points de collecte mockés
   */
  private mockPoints: PointDeCollecte[] = [
    {
      id: '1',
      localisation: { latitude: 36.8065, longitude: 10.1815 },
      typeDechet: TypeDechet.PLASTIQUE,
      etat: EtatConteneur.NORMAL,
      niveauRemplissage: 45,
    },
    {
      id: '2',
      localisation: { latitude: 36.8189, longitude: 10.1658 },
      typeDechet: TypeDechet.ALIMENTAIRE,
      etat: EtatConteneur.PLEIN,
      niveauRemplissage: 95,
    },
    {
      id: '3',
      localisation: { latitude: 36.7987, longitude: 10.1897 },
      typeDechet: TypeDechet.VERRE,
      etat: EtatConteneur.NORMAL,
      niveauRemplissage: 30,
    },
    {
      id: '4',
      localisation: { latitude: 36.8312, longitude: 10.1542 },
      typeDechet: TypeDechet.PLASTIQUE,
      etat: EtatConteneur.ENDOMMAGE,
      niveauRemplissage: 60,
    },
    {
      id: '5',
      localisation: { latitude: 36.8156, longitude: 10.1723 },
      typeDechet: TypeDechet.METAUX,
      etat: EtatConteneur.NORMAL,
      niveauRemplissage: 20,
    },
  ];

  private nextId = 6;

  /**
   * Récupère tous les points de collecte
   * Simule également la mise à jour aléatoire des niveaux de remplissage
   * @returns Observable avec la liste des points
   */
  getAll(): Observable<PointDeCollecte[]> {
    // Simule la mise à jour des niveaux (backend fait ça en réalité)
    this.simulateNiveauUpdate();

    return of([...this.mockPoints]);
  }

  /**
   * Crée un nouveau point de collecte
   * @param dto Données du point à créer
   * @returns Observable avec le point créé
   */
  create(dto: CreatePointCollecteDto): Observable<PointDeCollecte> {
    const point: PointDeCollecte = {
      id: (this.nextId++).toString(),
      localisation: dto.localisation,
      typeDechet: dto.typeDechet,
      etat: dto.etat || EtatConteneur.NORMAL,
      niveauRemplissage: dto.niveauRemplissage || 0,
    };

    this.mockPoints.push(point);
    return of(point);
  }

  /**
   * Met à jour un point de collecte
   * @param id ID du point
   * @param dto Données à mettre à jour
   * @returns Observable avec le point mis à jour
   */
  update(id: string, dto: UpdatePointCollecteDto): Observable<PointDeCollecte> {
    const index = this.mockPoints.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Point de collecte introuvable');
    }

    this.mockPoints[index] = {
      ...this.mockPoints[index],
      ...dto,
    };

    return of(this.mockPoints[index]);
  }

  /**
   * Supprime un point de collecte
   * @param id ID du point à supprimer
   * @returns Observable vide
   */
  delete(id: string): Observable<void> {
    this.mockPoints = this.mockPoints.filter((p) => p.id !== id);
    return of(undefined);
  }

  /**
   * Simule la mise à jour aléatoire des niveaux de remplissage
   * En réalité, c'est le backend qui fait ça avec les capteurs IoT
   */
  private simulateNiveauUpdate(): void {
    this.mockPoints.forEach((point) => {
      // Augmente aléatoirement le niveau (0 à 5%)
      const increase = Math.random() * 5;
      point.niveauRemplissage = Math.min(
        100,
        point.niveauRemplissage + increase
      );

      // Met à jour l'état selon le niveau
      if (point.niveauRemplissage >= 90) {
        point.etat = EtatConteneur.PLEIN;
      } else if (point.etat !== EtatConteneur.ENDOMMAGE) {
        point.etat = EtatConteneur.NORMAL;
      }
    });
  }
}
