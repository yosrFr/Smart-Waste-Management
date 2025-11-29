/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { GeoPoint } from '@smart-waste-management/shared/data-access';

/**
 * Configuration d'un marqueur sur la carte
 */
export interface MapMarker {
  position: GeoPoint;
  tooltip?: string;
  icon?: L.Icon | L.DivIcon;
  data?: any;
}

/**
 * Configuration d'une polyligne (circuit)
 */
export interface MapPolyline {
  points: GeoPoint[];
  color?: string;
}

/**
 * Composant carte Leaflet réutilisable
 */
@Component({
  selector: 'lib-leaflet-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaflet-map.html',
  styleUrl: './leaflet-map.css',
})
export class LeafletMapComponent implements AfterViewInit, OnDestroy {
  /** ID unique de la carte */
  @Input() mapId = 'map-' + Math.random().toString(36).substr(2, 9);

  /** Hauteur de la carte */
  @Input() height = 400;

  /** Largeur de la carte */
  @Input() width = '100%';

  /** Centre initial de la carte */
  @Input() center: GeoPoint = { latitude: 34.7442, longitude: 10.7487 };

  /** Zoom initial */
  @Input() zoom = 14;

  /** Marqueurs à afficher */
  @Input() markers: MapMarker[] = [];

  /** Polylignes (circuits) à afficher */
  @Input() polylines: MapPolyline[] = [];

  /** Active le mode sélection de position */
  @Input() selectionMode = false;

  /** Événement émis lors de la sélection d'une position */
  @Output() positionSelected = new EventEmitter<GeoPoint>();

  /** Événement émis lors du clic sur un marqueur */
  @Output() markerClick = new EventEmitter<MapMarker>();

  private map?: L.Map;
  private markerLayer?: L.LayerGroup;
  private polylineLayer?: L.LayerGroup;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  ngOnChanges(): void {
    if (this.map) {
      this.updateMarkers();
      this.updatePolylines();
    }
  }

  /**
   * Initialise la carte Leaflet
   */
  private initMap(): void {
    this.map = L.map(this.mapId).setView(
      [this.center.latitude, this.center.longitude],
      this.zoom
    );

    // Ajoute le tile layer OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
    }).addTo(this.map);

    // Crée les layers pour marqueurs et polylignes
    this.markerLayer = L.layerGroup().addTo(this.map);
    this.polylineLayer = L.layerGroup().addTo(this.map);

    // Mode sélection
    if (this.selectionMode) {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.positionSelected.emit({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      });
    }

    // Ajoute les marqueurs et polylignes initiaux
    this.updateMarkers();
    this.updatePolylines();
  }

  /**
   * Met à jour les marqueurs sur la carte
   */
  private updateMarkers(): void {
    if (!this.markerLayer) return;

    this.markerLayer.clearLayers();

    this.markers.forEach((markerConfig) => {
      const marker = L.marker(
        [markerConfig.position.latitude, markerConfig.position.longitude],
        {
          icon: markerConfig.icon || this.getDefaultIcon(),
        }
      );

      if (markerConfig.tooltip) {
        marker.bindTooltip(markerConfig.tooltip);
      }

      marker.on('click', () => {
        this.markerClick.emit(markerConfig);
      });

      marker.addTo(this.markerLayer!);
    });
  }

  /**
   * Met à jour les polylignes sur la carte
   */
  private updatePolylines(): void {
    if (!this.polylineLayer) return;

    this.polylineLayer.clearLayers();

    this.polylines.forEach((polylineConfig) => {
      const latLngs: L.LatLngExpression[] = polylineConfig.points.map((p) => [
        p.latitude,
        p.longitude,
      ]);

      const polyline = L.polyline(latLngs, {
        color: polylineConfig.color || '#2E7D32',
        weight: 3,
      });

      polyline.addTo(this.polylineLayer!);
    });
  }

  /**
   * Retourne l'icône par défaut
   */
  private getDefaultIcon(): L.Icon {
    return L.icon({
      iconUrl: 'assets/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }

  /**
   * Ajuste la vue pour afficher tous les marqueurs
   */
  fitBounds(): void {
    if (this.map && this.markers.length > 0) {
      const bounds = L.latLngBounds(
        this.markers.map((m) => [m.position.latitude, m.position.longitude])
      );
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
}
