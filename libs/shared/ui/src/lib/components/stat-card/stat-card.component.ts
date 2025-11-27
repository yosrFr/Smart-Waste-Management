/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * Composant carte de statistique pour les dashboards
 */
@Component({
  selector: 'lib-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: 'stat-card.component.html',
  styleUrl: 'stat-card.component.css',
})
export class StatCardComponent {
  /** Valeur à afficher (nombre ou texte) */
  @Input() value: string | number = 0;

  /** Label de la statistique */
  @Input() label = '';

  /** Sous-titre optionnel */
  @Input() subtitle?: string;

  /** Icône Material */
  @Input() icon = 'info';

}
