import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelService } from '@src/app/shared/components/panel/services/panel.service';
import { PanelModule } from '@src/app/shared/components/panel/panel.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { FilterToolbarForm } from '../../Forms/filter-toolbar.form';
import { iConditions } from '../../Interfaces/i-conditions.interface';
import { KassSelectyComponent } from "../../../kass/kass-selecty/kass-selecty.component";
import { KassInputyComponent } from "../../../kass/kass-inputy/kass-inputy.component";
import moment from 'moment';

export interface iOperators {
  id: number;
  label: string;
  value: any,
  description: string;
}

@Component({
  selector: 'panel-filters-report',
  imports: [
    CommonModule,
    PanelModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    KassSelectyComponent,
    KassInputyComponent,
  ],
  templateUrl: './filters-tollbar.panel.html',
})
export class FiltersToolbarPanel {

  selectedValue: any = null;
  selectedColumnValue: any = null;
  selectedOperatorValue: any = null;

  @Output() onFilterConditions: EventEmitter<iConditions[]> = new EventEmitter();
  @Output() onClosePanel: EventEmitter<iConditions[]> = new EventEmitter();

  @Input() lists: any;
  @Input() conditions: iConditions[] = [];
  internalConditions: iConditions[] = [];
  listColumnSelected: any[] = [];
  viewMode: 'condicional' | 'predefinido' = 'condicional';
  filterSearch: string = '';
  @Input() predefinedFilters: any[] = [];

  public panelService = inject(PanelService);
  public filterForm = inject(FilterToolbarForm);

  columns!: iOperators[];

  operators: iOperators[] = [
    { id: 1, label: 'Igual a', value: "Igual a", description: "Valor exatamente como o conteudo da coluna" },
    { id: 2, label: 'Contem', value: "Contem", description: "Valor está dentro do valor da coluna" },
    { id: 3, label: 'Diferente de', value: "Diferente de", description: "Diferente do conteudo da coluna" },
    { id: 4, label: 'Não contem', value: "Não contem", description: "Valor não está no conteudo da coluna" },
    // {id: 5, label: 'Está entre', value: "Está entre", description: "Está entre" },
    { id: 0, label: '**Valores especiais', value: "Valores especiais", description: "Operador que libera campos com variaveis especiais" },
  ]

  specialValues = [
    { label: 'Igual a {HOJE}', value: "{HOJE}", description: "Irá pegar a data atual" },
    { label: 'Igual a {ONTEM}', value: "{ONTEM}", description: "Irá pegar a data de ontem" },
    { label: 'Igual a {AMANHA}', value: "{AMANHA}", description: "Irá pegar a data de amanhã" },
    { label: 'Igual a {MES_ATUAL}', value: "{MES_ATUAL}", description: "Irá pegar o mês atual" },
    { label: 'Igual a {MES_PASSADO}', value: "{MES_PASSADO}", description: "Irá pegar o mês passado em relação ao atual" },
    { label: 'Igual a {MES_SEGUINTE}', value: "{MES_SEGUINTE}", description: "Irá pegar o mês seguinte em relação ao atual" },
  ];

  ngOnInit() {
    this.prepareColColumns();
    this.internalConditions = JSON.parse(JSON.stringify(this.conditions));
  }

  prepareColColumns() {
    this.columns = (this.lists?.columns ?? [])
      .filter((item: any) => item.label !== '#')
      .map((item: any) => ({
        label: item.label,
        value: item.field,
        optionLabel: item.label,
        data: item
      }));
  }

  emitFilterConditions() {
    this.onFilterConditions.emit(this.internalConditions);
    this.closePanel();
  }

  addCondition() {

    if (!this.selectedColumnValue || !this.selectedColumnValue) return;

    // let value = '';
    // switch (this.columnsSelectedType && this.selectedOperatorValue.id !== 0) {
    //   // case 'datetime':
    //   // case 'date': value = moment(this.selectedValueFinal).format('DD/MM/YYYY'); break;
    //   default: value = this.selectedValueFinal; break;
    // }

    // switch (this.columnsSelectedType && this.selectedOperatorValue.id !== 0) {
    //   // case 'date': value = moment(this.selectedValueFinal).format('DD/MM/YYYY'); break;
    //   default: value = this.selectedValueFinal; break;
    // }

    const cond = {
      label: this.selectedColumnValue.label,
      column: this.selectedColumnValue.value,
      operator: this.selectedOperatorValue.value,
      value: this.selectedValueFinal,
    };
    this.internalConditions.push(cond);

    this.selectedColumnValue = null;
    this.selectedOperatorValue = null;
    this.selectedValue = null;

  }

  get selectedValueFinal() {
    let val = this.selectedValue.value ?? this.selectedValue;
    let type = this.selectedValue.value ?? this.selectedValue;

    switch (val) {
      case '{HOJE}': val = moment().format('DD/MM/YYYY'); break;
      case '{ONTEM}': val = moment().subtract(1, 'day').format('DD/MM/YYYY'); break;
      case '{AMANHA}': val = moment().add(1, 'day').format('DD/MM/YYYY'); break;
      case '{MES_ATUAL}': val = moment().format('MM/YYYY'); break;
      case '{MES_PASSADO}': val = moment().subtract(1, 'month').format('MM/YYYY'); break;
      case '{MES_SEGUINTE}': val = moment().add(1, 'month').format('MM/YYYY'); break;
      // case '{NULO}': val = "NULO"; break;
    }

    switch (this.columnsSelectedType) {
      case 'date': val = moment(val).format('DD/MM/YYYY'); break;
      case 'datetime': val = moment(val).format('DD/MM/YYYY HH:mm'); break;
    }

    return val;
  }

  removeCondition(cond: any) {
    const index = this.internalConditions.findIndex((c: any) =>
      c.column === cond.column &&
      c.operator === cond.operator &&
      c.value === cond.value
    );

    if (index !== -1) {
      this.internalConditions.splice(index, 1);
    }
  }

  closePanel() {
    this.selectedColumnValue = null;
    this.selectedOperatorValue = null;
    this.selectedValue = null;
    this.onClosePanel.emit();
    this.panelService.close();
  }

  trackByCondition(index: number, cond: iConditions) {
    return cond.column + cond.operator + cond.value;
  }

  selectColumnValue(e: any) {
    this.listColumnSelected = e.data?.list ?? null;

    if (this.listColumnSelected) {
      this.selectedOperatorValue = { label: 'Igual a', value: 'Igual a' };
    }
  }

  get columnsSelectedType() {

    const value = this.selectedColumnValue;

    if (value && value['data']?.list) {
      return 'list';
    } else if (value && value['data']?.type) {
      return value['data'].type;
    } else {
      return 'text';
    }
  }

  // get listColumnSelected(): Array<iSelecty> {
  //   return [] //this.selectedColumnValue?.['list'] ?? [];
  // }

  // set selectedColumnValue(val: any) {
  //   console.log(val)
  // }


  // get selectedColumnValue() {
  //   return this._selectedColumnValue;
  // }

  // get currentValue(): any {
  //   if (this.columnsSelectedType === 'list') return this.selectedValue?.value ?? null;
  //   return this.filterForm.form.get('value')?.value ?? null;
  // }

  // private _selectedColumnValue: any | null = null;

  filteredPredefinedFilters() {
    if (!this.lists.predefined) return;
    const term = this.filterSearch.toLowerCase();
    return this.lists.predefined.filter((f: any) =>
      f.title.toLowerCase().includes(term) || f.description.toLowerCase().includes(term)
    );
  }

  selectPredefinedFilter(filtro: any) {
    this.internalConditions = structuredClone(filtro.conditions.rules);
    this.emitFilterConditions();
  }
}
