import { Injectable } from "@angular/core";
import moment from "moment";
import { BaseFiltersForm } from "./filters-report-base.form";

@Injectable({ providedIn: 'root' })
export class FiltersToolbarForm extends BaseFiltersForm {

  constructor() {
    super();
    this.CONFIG_FILTERS = [
      { name: "column", value: null, label: "Colunas", type: 'text' },
      { name: "operator", value: null, label: "Operadores", type: 'text' },
      { name: "value", value: null, label: "Valor", type: 'text' },
      { name: "label", value: null, label: "Label", type: 'text' },
    ];
    this.createForm();
  }
}
