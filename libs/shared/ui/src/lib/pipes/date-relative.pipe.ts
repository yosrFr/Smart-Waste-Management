/* eslint-disable @nx/enforce-module-boundaries */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe pour afficher une date relative (il y a X minutes ou heures)
 */
@Pipe({
  name: 'dateRelative',
  standalone: true,
})
export class DateRelativePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffSec < 60) {
      return "À l'instant";
    } else if (diffMin < 60) {
      return `Il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
    } else if (diffHour < 24) {
      return `Il y a ${diffHour} heure${diffHour > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  }
}
