/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import {
  LeafletMapComponent,
  MapMarker,
  LoadingSpinnerComponent,
} from '@smart-waste-management/shared/ui';
import {
  PointDeCollecte,
  EtatConteneur,
  loadPointsCollecte,
} from '@smart-waste-management/shared/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-points-collecte-map',
  standalone: true,
  imports: [CommonModule, LeafletMapComponent, LoadingSpinnerComponent],
  templateUrl: './points-de-collecte-map.component.html',
  styleUrl: './points-de-collecte-map.component.css',
})
export class PointsCollecteMapComponent implements OnChanges, OnInit {
  @Input() points: PointDeCollecte[] = [];
  @Input() center = { latitude: 34.7442, longitude: 10.7487 };
  @Input() loading$: any;

  @Output() markerClick = new EventEmitter<PointDeCollecte>();

  markers: MapMarker[] = [];
  private store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(loadPointsCollecte());
  }

  ngOnChanges(): void {
    this.updateMarkers();
  }

  private updateMarkers(): void {
    const validPoints = this.points.filter(
      (p) =>
        p?.localisation &&
        Number.isFinite(p.localisation.latitude) &&
        Number.isFinite(p.localisation.longitude)
    );

    this.markers = validPoints.map((point) => ({
      position: point.localisation,
      tooltip: this.getTooltip(point),
      icon: this.getMarkerIcon(point),
      data: point,
    }));
  }

  private getTooltip(point: PointDeCollecte): string {
    return `
      Type: ${point.typeDechet}
      Niveau: ${point.niveauRemplissage.toFixed(0)}%
      État: ${point.etatConteneur}
    `;
  }

  private getMarkerIcon(point: PointDeCollecte): L.DivIcon {
    const baseColors: Record<string, string> = {
      PLASTIQUE: '#29b6f6',
      METAUX: '#ef5350',
      ALIMENTAIRE: '#ffcc55',
      VERRE: '#66bb6a',
      AUTRE: '#cccaca',
    };

    const darkerColors: Record<string, string> = {
      PLASTIQUE: '#01579b',
      METAUX: '#b71c1c',
      ALIMENTAIRE: '#ffb300',
      VERRE: '#2e7d32',
      AUTRE: '#838383',
    };

    const typeKey = point.typeDechet as string;
    let color = baseColors[typeKey] ?? '#ccc';

    if (point.etatConteneur === EtatConteneur.ENDOMMAGE) {
      color = '#000';
    } else if (point.etatConteneur === EtatConteneur.PLEIN) {
      color = darkerColors[typeKey] ?? color;
    }

    return L.divIcon({
      html: `<div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      className: '',
    });
  }

  onMarkerClicked(marker: MapMarker): void {
    this.markerClick.emit(marker.data as PointDeCollecte);
  }
}
