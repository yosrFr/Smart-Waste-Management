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
import { PageHeaderComponent } from '@smart-waste-management/shared/ui';
import {
  TypeDechet,
  SignalementService,
} from '@smart-waste-management/shared/data-access';

/**
 * Composant Signaler un problème (Employee)
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
  template: ``,
  styles: [``],
})
export class SignalerComponent {
  private fb = inject(FormBuilder);
  private signalementService = inject(SignalementService);
  private snackBar = inject(MatSnackBar);

  conteneurForm: FormGroup;
  vehiculeForm: FormGroup;
  incidentForm: FormGroup;
  submitting = false;

  TypeDechet = TypeDechet;

  constructor() {
    // Formulaire conteneur endommagé
    this.conteneurForm = this.fb.group({
      latitude: [36.8065, [Validators.required]],
      longitude: [10.1815, [Validators.required]],
      typeDechet: ['', [Validators.required]],
      description: [''],
    });

    // Formulaire véhicule en panne
    this.vehiculeForm = this.fb.group({
      matricule: ['', [Validators.required]],
      typeDechet: ['', [Validators.required]],
      latitude: [36.8065, [Validators.required]],
      longitude: [10.1815, [Validators.required]],
      description: [''],
    });

    // Formulaire incident
    this.incidentForm = this.fb.group({
      latitude: [36.8065, [Validators.required]],
      longitude: [10.1815, [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  /**
   * Récupère la position
   */
  getLocation(formType: 'conteneur' | 'incident'): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          switch (formType) {
            case 'conteneur':
              this.conteneurForm.patchValue({ latitude: lat, longitude: lng });
              break;
            case 'incident':
              this.incidentForm.patchValue({ latitude: lat, longitude: lng });
              break;
          }

          this.snackBar.open('Position récupérée', 'Fermer', {
            duration: 2000,
          });
        },
        (error) => {
          this.snackBar.open('Impossible de récupérer la position', 'Fermer', {
            duration: 3000,
          });
        }
      );
    } else {
      this.snackBar.open(
        "La géolocalisation n'est pas supportée par votre navigateur",
        'Fermer',
        { duration: 3000 }
      );
    }
  }

  /**
   * Signale un conteneur endommagé
   */
  signalerConteneur(): void {
    if (this.conteneurForm.valid && !this.submitting) {
      this.submitting = true;
      const formValue = this.conteneurForm.value;

      this.signalementService
        .signalerConteneur({
          localisation: {
            latitude: formValue.latitude,
            longitude: formValue.longitude,
          },
          typeDechet: formValue.typeDechet,
        })
        .subscribe({
          next: () => {
            this.snackBar.open(
              'Conteneur endommagé signalé avec succès',
              'Fermer',
              { duration: 3000 }
            );
            this.conteneurForm.reset({
              latitude: 36.8065,
              longitude: 10.1815,
            });
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
  }

  /**
   * Signale un véhicule en panne
   */
  signalerVehicule(): void {
    if (this.vehiculeForm.valid && !this.submitting) {
      this.submitting = true;
      const formValue = this.vehiculeForm.value;

      this.signalementService
        .signalerVehicule({
          matricule: formValue.matricule,
          typeDechet: formValue.typeDechet,
        })
        .subscribe({
          next: () => {
            this.snackBar.open(
              'Véhicule en panne signalé avec succès',
              'Fermer',
              { duration: 3000 }
            );
            this.vehiculeForm.reset({
              latitude: 36.8065,
              longitude: 10.1815,
            });
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
  }

  /**
   * Signale un incident sur le trajet
   */
  signalerIncident(): void {
    if (this.incidentForm.valid && !this.submitting) {
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
            this.incidentForm.reset({
              latitude: 36.8065,
              longitude: 10.1815,
            });
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
  }
}
