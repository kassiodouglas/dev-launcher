import { EventEmitter, Injectable, Output } from "@angular/core";
import { iConditions } from "../Interfaces/i-conditions.interface";

@Injectable()
export class FilterToolbarService {

  public conditions: iConditions[] = [];

  @Output() onReloadData: EventEmitter<boolean> = new EventEmitter();
  emitReloadData() {
    this.onReloadData.emit(true);
  }

  @Output() onFilterConditions: EventEmitter<iConditions[]> = new EventEmitter();
  emitFilterConditions(conditions: iConditions[]) {
    this.onFilterConditions.emit(conditions);
  }

  cacheConditions(page: string, conditions: iConditions[]): void {
    localStorage.setItem(`filter_page_${page}`, JSON.stringify(conditions));
  }

  getCachedConditions(page: string): iConditions[] {
    const data = localStorage.getItem(`filter_page_${page}`);
    return data ? JSON.parse(data) : [];
  }

  clearCachedConditions(page: string): void {
    localStorage.removeItem(`filter_page_${page}`);
  }


}
