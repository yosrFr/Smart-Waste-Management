/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Composant spinner de chargement
 */
@Component({
  selector: 'lib-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css',
})
export class LoadingSpinnerComponent {
  /** Diamètre du spinner */
  @Input() diameter = 50;

  /** Message à afficher sous le spinner */
  @Input() message?: string;

  /** Si true, affiche un overlay plein écran */
  @Input() overlay = false;
}
