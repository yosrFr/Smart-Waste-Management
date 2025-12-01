/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Vehicule, CreateVehiculeDto } from '../models';
import { StatutVehicule, TypeDechet } from '../enums';

/**
 * Service pour gérer les véhicules
 */
@Injectable({
  providedIn: 'root',
})
export class VehiculeService {
  /**
   * Véhicules mockés
   */
  private mockVehicules: Vehicule[] = [
    {
      id: '1',
      matricule: 'TUN1234',
      marque: 'Renault Trucks',
      capaciteMax: 12000,
      poidsVide: 8000,
      typeDechet: TypeDechet.PLASTIQUE,
      statut: StatutVehicule.ACTIF,
    },
    {
      id: '2',
      matricule: 'TUN5678',
      marque: 'Mercedes-Benz',
      capaciteMax: 15000,
      poidsVide: 9000,
      typeDechet: TypeDechet.ALIMENTAIRE,
      statut: StatutVehicule.EN_MISSION,
    },
    {
      id: '3',
      matricule: 'TUN9012',
      marque: 'Volvo',
      capaciteMax: 10000,
      poidsVide: 7500,
      typeDechet: TypeDechet.VERRE,
      statut: StatutVehicule.ACTIF,
    },
    {
      id: '4',
      matricule: 'TUN3456',
      marque: 'Iveco',
      capaciteMax: 11000,
      poidsVide: 7800,
      typeDechet: TypeDechet.METAUX,
      statut: StatutVehicule.EN_REPARATION,
    },
  ];

  private nextId = 5;

  /**
   * Récupère tous les véhicules
   * @returns Observable avec la liste des véhicules
   */
  getAll(): Observable<Vehicule[]> {
    return of([...this.mockVehicules]);
  }

  /**
   * Crée un nouveau véhicule
   * @param dto Données du véhicule à créer
   * @returns Observable avec le véhicule créé
   */
  create(dto: CreateVehiculeDto): Observable<Vehicule> {
    const vehicule: Vehicule = {
      id: (this.nextId++).toString(),
      ...dto,
      statut: StatutVehicule.ACTIF,
    };

    this.mockVehicules.push(vehicule);
    return of(vehicule);
  }

  /**
   * Met à jour un véhicule
   * @param id ID du véhicule
   * @param dto Données à mettre à jour
   * @returns Observable avec le véhicule mis à jour
   */
  update(id: string, dto: Partial<CreateVehiculeDto>): Observable<Vehicule> {
    const index = this.mockVehicules.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error('Véhicule introuvable');
    }

    this.mockVehicules[index] = {
      ...this.mockVehicules[index],
      ...dto,
    };

    return of(this.mockVehicules[index]);
  }

  /**
   * Supprime un véhicule
   * @param id ID du véhicule à supprimer
   * @returns Observable vide
   */
  delete(id: string): Observable<void> {
    this.mockVehicules = this.mockVehicules.filter((v) => v.id !== id);
    return of(undefined);
  }
}
