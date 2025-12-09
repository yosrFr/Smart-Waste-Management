/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import {
  PointDeCollecte,
  TypeDechet,
  EtatConteneur,
  createPointCollecte,
  updatePointCollecte,
  GeoPoint,
} from '@smart-waste-management/shared/data-access';
import { MapChooserDialogComponent } from '@smart-waste-management/shared/ui';

/**
 * Dialog pour ajouter/modifier un point de collecte
 */
@Component({
  selector: 'lib-point-collecte-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './points-de-collecte-form-dialog.component.html',
  styleUrl: './points-de-collecte-form-dialog.component.css',
})
export class PointCollecteFormDialogComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<PointCollecteFormDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as PointDeCollecte | null;
  private dialog = inject(MatDialog);

  form: FormGroup;
  isEditMode = false;

  // Expose les enums au template
  TypeDechet = TypeDechet;
  EtatConteneur = EtatConteneur;

  constructor() {
    this.isEditMode = !!this.data;

    this.form = this.fb.group({
      latitude: [
        this.data?.localisation.latitude || 34.7065,
        [Validators.required],
      ],
      longitude: [
        this.data?.localisation.longitude || 10.7487,
        [Validators.required],
      ],
      typeDechet: [this.data?.typeDechet || '', [Validators.required]],
      etat: [this.data?.etat || EtatConteneur.NORMAL],
      niveauRemplissage: [
        this.data?.niveauRemplissage || 0,
        [Validators.min(0), Validators.max(100)],
      ],
    });
  }

  /**
   * Ouvre un dialog pour choisir sur la carte
   */
  chooseOnMap(): void {
    const dialogRef = this.dialog.open(MapChooserDialogComponent, {
      width: '800px',
      height: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((coords) => {
      if (coords) {
        this.form.patchValue({
          latitude: coords.lat,
          longitude: coords.lng,
        });
      }
    });
  }

  /**
   * Soumet le formulaire
   */
  onSubmit(): void {
    if (this.form.valid) {
      const localisation: GeoPoint = {
        latitude: this.form.value.latitude,
        longitude: this.form.value.longitude,
      };

      if (this.isEditMode && this.data) {
        // Mode édition
        this.store.dispatch(
          updatePointCollecte({
            id: this.data.id,
            dto: {
              localisation,
              typeDechet: this.form.value.typeDechet,
            },
          })
        );
      } else {
        // Mode création
        this.store.dispatch(
          createPointCollecte({
            dto: {
              localisation,
              typeDechet: this.form.value.typeDechet,
              capacite: 50,
            },
          })
        );
      }

      this.dialogRef.close(true);
    }
  }

  /**
   * Annule et ferme le dialog
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
