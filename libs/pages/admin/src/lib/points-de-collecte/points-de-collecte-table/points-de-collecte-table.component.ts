/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DataTableComponent,
  TableColumn,
  TableAction,
  LoadingSpinnerComponent,
} from '@smart-waste-management/shared/ui';
import { PointDeCollecte } from '@smart-waste-management/shared/data-access';

@Component({
  selector: 'lib-points-collecte-table',
  standalone: true,
  imports: [CommonModule, DataTableComponent, LoadingSpinnerComponent],
  templateUrl: './points-de-collecte-table.component.html',
})
export class PointsCollecteTableComponent {
  @Input() points: PointDeCollecte[] = [];
  @Input() tableColumns: TableColumn<PointDeCollecte>[] = [];
  @Input() tableActions: TableAction<PointDeCollecte>[] = [];
  @Input() loading$: any;
}
