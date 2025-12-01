/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

/**
 * Composant badge de statut coloré
 */
@Component({
  selector: 'lib-status-badge',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css',
})
export class StatusBadgeComponent {
  /** Label du badge */
  @Input() label = '';

  /** Couleur (success, warning, danger, info, default) */
  @Input() color: 'success' | 'warning' | 'danger' | 'info' | 'default' =
    'default';

  get colorClass(): string {
    return this.color;
  }
}
