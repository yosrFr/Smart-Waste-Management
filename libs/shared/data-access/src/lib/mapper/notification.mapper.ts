import {
  AppNotification,
  NotificationBase,
  NotificationConteneurEndommage,
  NotificationConteneurEndommageDetails,
  NotificationConteneurPlein,
  NotificationConteneurPleinDetails,
  NotificationIncident,
  NotificationIncidentDetails,
  NotificationNouvelleTache,
  NotificationNouvelleTacheDetails,
  NotificationPanneVehicule,
  NotificationVehiculeEnPanneDetails,
  PointDeCollecte,
  Tournee,
  Vehicule,
} from '../models';
import { TypeNotif } from '../enums';

export type EntityMap<T> = { [id: string]: T };

/**
 * Contexte spécifique pour chaque type de notification
 */
interface NotificationConteneurPleinContext {
  pointsCollecte: EntityMap<PointDeCollecte>;
}

interface NotificationConteneurEndommageContext {
  pointsCollecte: EntityMap<PointDeCollecte>;
}

interface NotificationPanneVehiculeContext {
  vehicules: EntityMap<Vehicule>;
}

interface NotificationNouvelleTacheContext {
  tournees: EntityMap<Tournee>;
  vehicules: EntityMap<Vehicule>;
}

/**
 * Mapper principal
 */
export function mapNotificationToApp(
  notif: NotificationBase,
  ctx:
    | NotificationConteneurPleinContext
    | NotificationConteneurEndommageContext
    | NotificationPanneVehiculeContext
    | NotificationNouvelleTacheContext
): AppNotification | null {
  // console.log('Notification reçue:', notif);

  switch (notif.type) {
    case TypeNotif.PLEIN:
      if ('pointsCollecte' in ctx) {
        return mapConteneurPlein(notif as NotificationConteneurPlein, ctx);
      }
      return null;

    case TypeNotif.ENDOMMAGE:
      if ('pointsCollecte' in ctx) {
        return mapConteneurEndommage(
          notif as NotificationConteneurEndommage,
          ctx
        );
      }
      return null;

    case TypeNotif.PANNE_VEHICULE:
      if ('vehicules' in ctx) {
        return mapVehiculeEnPanne(notif as NotificationPanneVehicule, ctx);
      }
      return null;

    case TypeNotif.INCIDENT:
      return mapIncident(notif as NotificationIncident);

    case TypeNotif.NOUVELLE_TACHE:
      if ('tournees' in ctx && 'vehicules' in ctx) {
        return mapNouvelleTache(notif as NotificationNouvelleTache, ctx);
      }
      return null;

    default:
      // console.log('Unknown notification type:', notif.type);
      return null;
  }
}

function mapConteneurPlein(
  notif: NotificationConteneurPlein,
  ctx: NotificationConteneurPleinContext
): AppNotification | null {
  // console.log('Données du contexte:', ctx);
  const point = ctx.pointsCollecte[notif.pointDeCollecteId];
  if (!point) {
    // console.log('Point de collecte non trouvé:', notif.pointDeCollecteId);
    return null;
  }

  const details: NotificationConteneurPleinDetails = {
    localisation: point.localisation,
    typeConteneur: point.typeDechet,
    niveauRemplissage: point.niveauRemplissage,
  };
  // console.log('Point de collecte:', point);

  return {
    ...notif,
    details,
  };
}

function mapConteneurEndommage(
  notif: NotificationConteneurEndommage,
  ctx: NotificationConteneurEndommageContext
): AppNotification | null {
  // console.log('Données du contexte:', ctx);
  const point = ctx.pointsCollecte[notif.pointDeCollecteId];
  if (!point) {
    // console.log('Point de collecte non trouvé:', notif.pointDeCollecteId);
    return null;
  }

  const details: NotificationConteneurEndommageDetails = {
    localisation: point.localisation,
    typeConteneur: point.typeDechet,
  };
  // console.log('Point de collecte:', point);

  return {
    ...notif,
    details,
  };
}

function mapVehiculeEnPanne(
  notif: NotificationPanneVehicule,
  ctx: NotificationPanneVehiculeContext
): AppNotification | null {
  // console.log('Données du contexte:', ctx);
  const vehicule = ctx.vehicules[notif.vehiculeId];
  if (!vehicule) {
    // console.log('Véhicule non trouvé:', notif.vehiculeId);
    return null;
  }

  const details: NotificationVehiculeEnPanneDetails = {
    matricule: vehicule.matricule,
    typeDechet: vehicule.typeDechet,
  };
  // console.log('Vehicule: ', vehicule);

  return {
    ...notif,
    details,
  };
}

function mapIncident(notif: NotificationIncident): AppNotification {
  const details: NotificationIncidentDetails = {
    localisation: notif.localisation,
  };

  return {
    ...notif,
    details,
  };
}

function mapNouvelleTache(
  notif: NotificationNouvelleTache,
  ctx: NotificationNouvelleTacheContext
): AppNotification | null {
  // console.log('Données du contexte:', ctx);
  const tournee = ctx.tournees[notif.tourneeId];
  const vehicule = ctx.vehicules[notif.vehiculeId];
  if (!tournee || !vehicule) {
    // console.log('Véhicule non trouvé:', notif.vehiculeId);
    // console.log('Tournée non trouvée:', notif.tourneeId);
    return null;
  }

  const details: NotificationNouvelleTacheDetails = {
    nbPointCollecte: tournee.pointsDeCollecte.length,
    dateDebut: tournee.dateDebut,
    dateFin: tournee.dateFin,
    vehiculeMatricule: vehicule.matricule,
  };

  // console.log('Tournée: ', tournee);
  // console.log('Vehicule: ', vehicule);

  return {
    ...notif,
    details,
  };
}
