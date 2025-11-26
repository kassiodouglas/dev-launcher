import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from '@angular/material/menu';
import { MenuItem } from '../report-filter/report-filter.component';
import { FormsModule } from '@angular/forms';
import { FilterToolbarService } from './Services/filter-toolbar.service';
import { PanelService } from '../panel/services/panel.service';
import { FiltersToolbarPanel } from './Panels/filters-tollbar/filters-tollbar.panel';
import { iAction } from './Interfaces/i-action.interface';

@Component({
  selector: 'comp-filter-toolbar',
  imports: [CommonModule, MatIconModule, MatMenuModule, FormsModule],
  templateUrl: 'filter-toolbar.component.html'
})
export class FilterToolbarComponent {
  @Input() actionsButtons: iAction[] = [];

  @Input() items: MenuItem[] | null = null;
  @Input() lists: any[] | null = null;

  @Output() onAction = new EventEmitter<any>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  filterOpened = false;

  filterToolbarService = inject(FilterToolbarService);
  panelService = inject(PanelService);

  isSearchMode = false;
  modelTerm = '';
  searchTerm = '';

  private removeTimeout: any;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'f') {
      event.preventDefault();
      this.toggleSearchMode();
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'e') {
      event.preventDefault();
      this.emitOpenFilters();
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'f5') {
      event.preventDefault();
      this.loadReport();
    }

    if (event.key.toLowerCase() === 'escape') {
      this.filterOpened = false;
    }
  }

  executeAction(action: any) {
    this.onAction.emit(action);
  }

  loadReport() {
    this.filterToolbarService.emitReloadData();
  }

  emitOpenFilters() {

    if (this.filterOpened) return;

    this.filterOpened = true;
    const panel = this.panelService.size('lg').back('static').render(FiltersToolbarPanel);
    panel.componentInstance.lists = this.lists;
    panel.componentInstance.conditions = this.filterToolbarService.conditions;
    panel.componentInstance.onFilterConditions.subscribe((conditions: any) => {
      this.filterToolbarService.conditions = conditions;
      this.loadReport();
      this.filterOpened = false;
    });

    panel.componentInstance.onClosePanel.subscribe(() => this.filterOpened = false);
  }

  toggleSearchMode() {
    this.isSearchMode = !this.isSearchMode;
    if (this.isSearchMode) {
      setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
    }
  }

  clearSearch() { this.modelTerm = ''; this.searchTerm = ''; }

  performSearch() {
    this.searchTerm = this.modelTerm;
    this.toggleSearchMode();

    const data = {
      label: "Pesquisa",
      column: "all",
      operator: "searchTerm",
      value: this.searchTerm
    };

    // Verifica se já existe
    const index = this.filterToolbarService.conditions.findIndex(
      (c: any) => c.column === data.column && c.operator === data.operator
    );

    if (index > -1) {
      // Atualiza o existente
      this.filterToolbarService.conditions[index] = data;
    } else {
      // Insere novo
      this.filterToolbarService.conditions.push(data);
    }

    this.loadReport();
  }

  removeCondition(cond: any) {
    // Limpa qualquer timeout anterior
    if (this.removeTimeout) {
      clearTimeout(this.removeTimeout);
    }

    const index = this.filterToolbarService.conditions.findIndex((c: any) =>
      c.column === cond.column &&
      c.operator === cond.operator &&
      c.value === cond.value
    );

    if (index !== -1) {
      this.filterToolbarService.conditions.splice(index, 1);
    }


    // Define um novo timeout de 300ms (pode ajustar)
    this.removeTimeout = setTimeout(() => {
      this.loadReport();
      this.removeTimeout = null;
    }, 500);
  }

  get appliedFiltersLength() {
    return this.filterToolbarService.conditions.length ?? 0; //this.acceptedFilters.filter(f => !!f.value).length + (this.searchTerm ? 1 : 0) + (this.predefinedFilter ? 1 : 0);
  }

}
