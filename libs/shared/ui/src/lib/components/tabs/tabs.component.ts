/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';

/**
 * Configuration d'un tab avec compteur
 */
export interface Tab {
  label: string;
  value: any;
}

/**
 * Composant tabs avec compteurs (badges)
 */
@Component({
  selector: 'lib-tabs',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatBadgeModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements AfterViewInit, OnChanges {
  /** Liste des tabs avec leurs compteurs */
  @Input() tabs: Tab[] = [];

  /** Index du tab sélectionné */
  @Input() selectedIndex = 0;

  /** Événement émis lors du changement de tab */
  @Output() tabChange = new EventEmitter<Tab>();

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    // Attendre le rendu complet
    requestAnimationFrame(() => this.updateTabsVisibility());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndex'] && !changes['selectedIndex'].firstChange) {
      // Mettre à jour la visibilité après un changement d'index
      requestAnimationFrame(() => this.updateTabsVisibility());
    }
  }

  onTabChange(index: number): void {
    this.selectedIndex = index;
    this.tabChange.emit(this.tabs[index]);
    requestAnimationFrame(() => this.updateTabsVisibility());
  }

  private updateTabsVisibility(): void {
    const container: HTMLElement | null =
      this.elementRef.nativeElement.querySelector('.tabs-content-container');
    if (!container) return;

    // Normalize active value to string for safe comparison with attribute values
    const activeTabValue = String(this.tabs[this.selectedIndex]?.value ?? '');

    const allTabContents = Array.from(
      container.querySelectorAll('[tab]')
    ) as HTMLElement[];
    allTabContents.forEach((element) => {
      const elementTabValue = (element.getAttribute('tab') ?? '').trim();
      if (elementTabValue === activeTabValue) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    });
  }
}
