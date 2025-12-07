/* eslint-disable @nx/enforce-module-boundaries */
import { GeoPoint } from '@smart-waste-management/shared/data-access';

/**
 * Calcule la distance entre deux points GPS en mètres (formule de Haversine)
 * @param point1 Premier point GPS
 * @param point2 Deuxième point GPS
 * @returns Distance en mètres
 */
export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calcule le bearing (direction) entre deux points GPS en degrés
 * @param point1 Point de départ
 * @param point2 Point d'arrivée
 * @returns Bearing en degrés (0-360)
 */
export function calculateBearing(point1: GeoPoint, point2: GeoPoint): number {
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return ((θ * 180) / Math.PI + 360) % 360;
}

/**
 * Calcule un point intermédiaire entre deux points GPS
 * @param point1 Point de départ
 * @param point2 Point d'arrivée
 * @param fraction Fraction du trajet (0 = point1, 1 = point2)
 * @returns Point intermédiaire
 */
export function interpolatePoint(
  point1: GeoPoint,
  point2: GeoPoint,
  fraction: number
): GeoPoint {
  const φ1 = (point1.latitude * Math.PI) / 180;
  const λ1 = (point1.longitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const λ2 = (point2.longitude * Math.PI) / 180;

  const d = calculateDistance(point1, point2) / 6371e3; // Distance angulaire

  const a = Math.sin((1 - fraction) * d) / Math.sin(d);
  const b = Math.sin(fraction * d) / Math.sin(d);

  const x = a * Math.cos(φ1) * Math.cos(λ1) + b * Math.cos(φ2) * Math.cos(λ2);
  const y = a * Math.cos(φ1) * Math.sin(λ1) + b * Math.cos(φ2) * Math.sin(λ2);
  const z = a * Math.sin(φ1) + b * Math.sin(φ2);

  const φ3 = Math.atan2(z, Math.sqrt(x * x + y * y));
  const λ3 = Math.atan2(y, x);

  return {
    latitude: (φ3 * 180) / Math.PI,
    longitude: (λ3 * 180) / Math.PI,
  };
}

/**
 * Calcule un nouveau point à partir d'un point de départ, d'une distance et d'un bearing
 * @param point Point de départ
 * @param distance Distance en mètres
 * @param bearing Direction en degrés
 * @returns Nouveau point GPS
 */
export function destinationPoint(
  point: GeoPoint,
  distance: number,
  bearing: number
): GeoPoint {
  const R = 6371e3; // Rayon de la Terre
  const δ = distance / R; // Distance angulaire
  const θ = (bearing * Math.PI) / 180;
  const φ1 = (point.latitude * Math.PI) / 180;
  const λ1 = (point.longitude * Math.PI) / 180;

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
    );

  return {
    latitude: (φ2 * 180) / Math.PI,
    longitude: (λ2 * 180) / Math.PI,
  };
}
