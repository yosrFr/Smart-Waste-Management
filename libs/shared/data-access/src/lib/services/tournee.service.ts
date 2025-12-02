/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tournee } from '../models';
import {
  StatutTournee,
  TypeDechet,
  StatutVehicule,
  Disponibilite,
  Role,
  EtatConteneur,
} from '../enums';

/**
 * Service pour gérer les tournées
 */
@Injectable({
  providedIn: 'root',
})
export class TourneeService {
  /**
   * Tournées mockées
   */
  private mockTournees: Tournee[] = [
    {
      id: '1',
      dateDeb: new Date().toISOString(),
      dateFin: new Date(Date.now() + 14400000).toISOString(),
      statut: StatutTournee.EN_COURS,
      vehicule: {
        id: '2',
        matricule: 'TUN5678',
        marque: 'Mercedes-Benz',
        capaciteMax: 15000,
        poidsVide: 9000,
        typeDechet: TypeDechet.ALIMENTAIRE,
        statut: StatutVehicule.EN_MISSION,
      },
      employe: {
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
      pointsDeCollecte: [
        {
          id: '2',
          localisation: { latitude: 36.8189, longitude: 10.1658 },
          typeDechet: TypeDechet.ALIMENTAIRE,
          etat: EtatConteneur.PLEIN,
          niveauRemplissage: 95,
        },
        {
          id: '5',
          localisation: { latitude: 36.8156, longitude: 10.1723 },
          typeDechet: TypeDechet.ALIMENTAIRE,
          etat: EtatConteneur.NORMAL,
          niveauRemplissage: 20,
        },
      ],
      positionActuelle: { latitude: 36.8189, longitude: 10.1658 },
    },
    {
      id: '2',
      dateDeb: new Date(Date.now() + 86400000).toISOString(),
      dateFin: new Date(Date.now() + 100800000).toISOString(),
      statut: StatutTournee.NON_COMMENCEE,
      vehicule: {
        id: '1',
        matricule: 'TUN1234',
        marque: 'Renault Trucks',
        capaciteMax: 12000,
        poidsVide: 8000,
        typeDechet: TypeDechet.PLASTIQUE,
        statut: StatutVehicule.ACTIF,
      },
      employe: {
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
      pointsDeCollecte: [
        {
          id: '1',
          localisation: { latitude: 36.8065, longitude: 10.1815 },
          typeDechet: TypeDechet.PLASTIQUE,
          etat: EtatConteneur.PLEIN,
          niveauRemplissage: 80,
        },
        {
          id: '4',
          localisation: { latitude: 36.8312, longitude: 10.1542 },
          typeDechet: TypeDechet.PLASTIQUE,
          etat: EtatConteneur.PLEIN,
          niveauRemplissage: 85,
        },
      ],
    },
    {
      id: '3',
      dateDeb: new Date(Date.now() - 86400000).toISOString(),
      dateFin: new Date(Date.now() - 72000000).toISOString(),
      statut: StatutTournee.TERMINEE,
      vehicule: {
        id: '3',
        matricule: 'TUN9012',
        marque: 'Volvo',
        capaciteMax: 10000,
        poidsVide: 7500,
        typeDechet: TypeDechet.VERRE,
        statut: StatutVehicule.ACTIF,
      },
      employe: {
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
      pointsDeCollecte: [
        {
          id: '3',
          localisation: { latitude: 36.7987, longitude: 10.1897 },
          typeDechet: TypeDechet.VERRE,
          etat: EtatConteneur.NORMAL,
          niveauRemplissage: 30,
        },
      ],
    },
  ];

  private nextId = 4;

  /**
   * Récupère toutes les tournées
   * @returns Observable avec la liste des tournées
   */
  getAll(): Observable<Tournee[]> {
    return of([...this.mockTournees]);
  }

  /**
   * Récupère les tournées d'un employé spécifique
   * @param employeId ID de l'employé
   * @returns Observable avec les tournées de l'employé
   */
  getByEmployeId(employeId: string): Observable<Tournee[]> {
    const tournees = this.mockTournees.filter(
      (t) => t.employe.id === employeId
    );
    return of(tournees);
  }
}
