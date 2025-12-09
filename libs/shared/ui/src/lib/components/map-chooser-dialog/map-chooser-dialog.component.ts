/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';

@Component({
  selector: 'lib-map-chooser-dialog',
  imports: [LeafletMapComponent],
  templateUrl: './map-chooser-dialog.component.html',
  styleUrl: './map-chooser-dialog.component.css',
})
export class MapChooserDialogComponent {
  @ViewChild(LeafletMapComponent) mapComp!: LeafletMapComponent;

  // coord sélectionnée en local
  chosen?: { lat: number; lng: number };

  private dialogRef = inject(MatDialogRef<MapChooserDialogComponent>);

  /**
   * Prend un point sur la carte et renvoie ses coordonnées
   * @param pos la latitude et longitude selectionner
   */
  onPosSelected(pos: { latitude: number; longitude: number }) {
    this.chosen = { lat: pos.latitude, lng: pos.longitude };
  }

  validate() {
    if (this.chosen) {
      this.dialogRef.close(this.chosen);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
