/* eslint-disable @nx/enforce-module-boundaries */
import { Pipe, PipeTransform } from '@angular/core';
import {
  StatutVehicule,
  StatutTournee,
  Disponibilite,
  TypeDechet,
  EtatConteneur,
  TypeNotif,
  Role,
} from '@smart-waste-management/shared/data-access';

/**
 * Pipe pour convertir les enums en labels lisibles
 */
@Pipe({
  name: 'enumLabel',
  standalone: true,
})
export class EnumLabelPipe implements PipeTransform {
  private readonly labels: Record<string, Record<string, string>> = {
    Role: {
      [Role.ADMIN]: 'Admin',
      [Role.EMPLOYE]: 'Employé',
    },
    StatutVehicule: {
      [StatutVehicule.ACTIF]: 'Actif',
      [StatutVehicule.INACTIF]: 'Inactif',
      [StatutVehicule.EN_REPARATION]: 'En réparation',
      [StatutVehicule.EN_MISSION]: 'En mission',
    },
    StatutTournee: {
      [StatutTournee.NON_COMMENCEE]: 'Non commencée',
      [StatutTournee.EN_COURS]: 'En cours',
      [StatutTournee.TERMINEE]: 'Terminée',
    },
    Disponibilite: {
      [Disponibilite.DISPONIBLE]: 'Disponible',
      [Disponibilite.EN_MISSION]: 'En mission',
    },
    TypeDechet: {
      [TypeDechet.PLASTIQUE]: 'Plastique',
      [TypeDechet.METAUX]: 'Métaux',
      [TypeDechet.ALIMENTAIRE]: 'Alimentaire',
      [TypeDechet.VERRE]: 'Verre',
      [TypeDechet.AUTRE]: 'Autre',
    },
    EtatConteneur: {
      [EtatConteneur.NORMAL]: 'Normal',
      [EtatConteneur.ENDOMMAGE]: 'Endommagé',
      [EtatConteneur.PLEIN]: 'Plein',
      [EtatConteneur.SUPPRIME]: 'Supprimé',
    },
    TypeNotif: {
      [TypeNotif.PLEIN]: 'Conteneur plein',
      [TypeNotif.ENDOMMAGE]: 'Conteneur endommagé',
      [TypeNotif.PANNE]: 'Véhicule en panne',
      [TypeNotif.INCIDENT]: 'Incident sur le trajet',
      [TypeNotif.NOUVELLE_TACHE]: 'Nouvelle tâche',
    },
  };

  transform(value: string, enumType: string): string {
    if (!value || !enumType) return value;

    const enumLabels = this.labels[enumType];
    return enumLabels?.[value] || value;
  }
}
