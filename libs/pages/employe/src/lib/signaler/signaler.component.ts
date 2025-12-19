/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MapChooserDialogComponent,
  PageHeaderComponent,
} from '@smart-waste-management/shared/ui';
import {
  TypeDechet,
  SignalementService,
  PointDeCollecte,
  Vehicule,
  selectAllPointsCollecte,
  selectAllVehicules,
  loadPointsCollecte,
} from '@smart-waste-management/shared/data-access';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { calculateDistance } from '@smart-waste-management/shared/utils';

/**
 * Composant Signaler un problème
 * Permet de signaler un conteneur endommagé, un véhicule en panne ou un incident
 */
@Component({
  selector: 'lib-signaler',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
  ],
  templateUrl: './signaler.component.html',
  styleUrl: './signaler.component.css',
})
export class SignalerComponent {
  private fb = inject(FormBuilder);
  private signalementService = inject(SignalementService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private store = inject(Store);

  /** Formulaire pour signaler un conteneur endommagé */
  conteneurForm: FormGroup;

  /** Formulaire pour signaler un véhicule en panne */
  vehiculeForm: FormGroup;

  /** Formulaire pour signaler un incident */
  incidentForm: FormGroup;

  /** Indique si un signalement est en cours de soumission */
  submitting = false;

  /** Enum des types de déchets */
  TypeDechet = TypeDechet;

  // Entités du store
  pointsCollecte: PointDeCollecte[] = [];
  vehicules: Vehicule[] = [];

  constructor() {
    this.store.dispatch(loadPointsCollecte());

    // Récupération des entités depuis le store
    this.store.select(selectAllPointsCollecte).subscribe((points) => {
      this.pointsCollecte = points;
    });

    this.store.select(selectAllVehicules).subscribe((vehicules) => {
      this.vehicules = vehicules;
    });

    // Formulaire conteneur endommagé
    this.conteneurForm = this.fb.group({
      latitude: [34.7065, [Validators.required]],
      longitude: [10.7487, [Validators.required]],
      typeDechet: ['', [Validators.required]],
    });

    // Formulaire véhicule en panne
    this.vehiculeForm = this.fb.group({
      matricule: ['', [Validators.required]],
      typeDechet: ['', [Validators.required]],
    });

    // Formulaire incident
    this.incidentForm = this.fb.group({
      latitude: [34.7065, [Validators.required]],
      longitude: [10.7487, [Validators.required]],
    });
  }

  /**
   * Ouvre une dialog pour choisir une position sur la carte
   * @param type 'conteneur' ou 'incident'
   */
  chooseOnMap(type: 'conteneur' | 'incident') {
    const dialogRef = this.dialog.open(MapChooserDialogComponent, {
      width: '800px',
      height: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((coords) => {
      if (coords) {
        if (type === 'conteneur') {
          this.conteneurForm.patchValue({
            latitude: coords.lat,
            longitude: coords.lng,
          });
        } else if (type === 'incident') {
          this.incidentForm.patchValue({
            latitude: coords.lat,
            longitude: coords.lng,
          });
        }
      }
    });
  }

  /**
   * Signale un conteneur endommagé
   */
  signalerConteneur(): void {
    if (!this.conteneurForm.valid || this.submitting) return;
    this.submitting = true;

    const formValue = this.conteneurForm.value;
    const pointId = this.getClosestPointId({
      latitude: formValue.latitude,
      longitude: formValue.longitude,
      typeDechet: formValue.typeDechet,
    });

    if (!pointId) {
      this.snackBar.open('Aucun point de collecte trouvé', 'Fermer', {
        duration: 3000,
      });
      this.submitting = false;
      return;
    }

    this.signalementService
      .signalerConteneur({
        pointDeCollecteId: pointId,
      })
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Conteneur endommagé signalé avec succès',
            'Fermer',
            { duration: 3000 }
          );
          this.conteneurForm.reset({ latitude: 34.7065, longitude: 10.7487 });
          this.submitting = false;
        },
        error: () => {
          this.snackBar.open('Erreur lors du signalement', 'Fermer', {
            duration: 3000,
          });
          this.submitting = false;
        },
      });
  }

  /**
   * Signale un véhicule en panne
   */
  signalerVehicule(): void {
    if (!this.vehiculeForm.valid || this.submitting) return;
    this.submitting = true;

    const formValue = this.vehiculeForm.value;
    const vehiculeId = this.getVehiculeIdByMatricule(
      formValue.matricule,
      formValue.typeDechet
    );
    if (!vehiculeId) {
      this.snackBar.open('Véhicule introuvable', 'Fermer', { duration: 3000 });
      this.submitting = false;
      return;
    }

    this.signalementService
      .signalerVehicule({
        vehiculeId,
        localisation: { latitude: 0, longitude: 0 },
      })
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Véhicule en panne signalé avec succès',
            'Fermer',
            { duration: 3000 }
          );
          this.vehiculeForm.reset();
          this.submitting = false;
        },
        error: () => {
          this.snackBar.open('Erreur lors du signalement', 'Fermer', {
            duration: 3000,
          });
          this.submitting = false;
        },
      });
  }

  /**
   * Signale un incident sur le trajet
   */
  signalerIncident(): void {
    if (!this.incidentForm.valid || this.submitting) return;
    this.submitting = true;

    const formValue = this.incidentForm.value;
    this.signalementService
      .signalerIncident({
        localisation: {
          latitude: formValue.latitude,
          longitude: formValue.longitude,
        },
      })
      .subscribe({
        next: () => {
          this.snackBar.open('Incident signalé avec succès', 'Fermer', {
            duration: 3000,
          });
          this.incidentForm.reset({ latitude: 34.7065, longitude: 10.7487 });
          this.submitting = false;
        },
        error: () => {
          this.snackBar.open('Erreur lors du signalement', 'Fermer', {
            duration: 3000,
          });
          this.submitting = false;
        },
      });
  }

  private getClosestPointId(data: {
    latitude: number;
    longitude: number;
    typeDechet: TypeDechet;
  }): string | null {
    if (!data.typeDechet || !this.pointsCollecte?.length) return null;

    // Filtrer les points de collecte compatibles avec le type de déchet
    const compatiblePoints = this.pointsCollecte.filter(
      (p) =>
        p &&
        p.localisation &&
        (p.typeDechet === data.typeDechet ||
          p.typeDechet === TypeDechet[data.typeDechet])
    );
    if (!compatiblePoints.length) return null;

    // Calculer la distance et retourner l'id le plus proche
    let minDist = Infinity;
    let closestId: string | null = null;

    for (const p of compatiblePoints) {
      const dist = calculateDistance(
        { latitude: data.latitude, longitude: data.longitude },
        p.localisation
      );

      if (!isNaN(dist) && dist < minDist) {
        minDist = dist;
        closestId = p.id;
      }
    }

    return closestId;
  }

  private getVehiculeIdByMatricule(
    matricule: string,
    typeDechet: TypeDechet
  ): string | null {
    if (!matricule || !typeDechet || !this.vehicules?.length) return null;

    const vehicule = this.vehicules.find(
      (v) => v && v.matricule === matricule && v.typeDechet === typeDechet
    );
    return vehicule?.id ?? null;
  }
}
