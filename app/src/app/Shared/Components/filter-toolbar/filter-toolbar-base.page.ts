import { Directive, inject } from "@angular/core";
import { PanelService } from "../panel/services/panel.service";
import { FilterToolbarService } from "./Services/filter-toolbar.service";
import { iAction } from "./Interfaces/i-action.interface";

@Directive()
export abstract class FilterToolbarBasePage {

  panelService = inject(PanelService);

  filterToolbarService = inject(FilterToolbarService);

  protected executeAction(action:iAction){
    action.method();
  }

}
