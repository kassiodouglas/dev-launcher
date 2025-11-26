import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'comp-selecty',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  templateUrl: './selecty.component.html',
  styleUrls: ['./selecty.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormSelectyComponent,
      multi: true
    }
  ]
})
export class FormSelectyComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() label = '';
  @Input() placeholder:string|null = null;
  @Input() options: { label: string; value: any }[] = [];
  @Input() multiple = false;
  @Input() minItems = 1;
  @Input() disabled = false;
  @Input() formControl?: AbstractControl; // recebe o formControlName do pai

  @Output() selectionChange = new EventEmitter<any>();

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  searchTerm = '';
  filteredOptions: { label: string; value: any }[] = [];
  opened = false;

  value: any = this.multiple ? [] : null;

  // ControlValueAccessor
  onChange = (_: any) => {};
  onTouched = () => {};

  get selected() {
    return this.value;
  }

  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.filteredOptions = this.filterOptions(this.searchTerm);
    }
  }

  writeValue(value: any): void {
    this.value = value ?? (this.multiple ? [] : null);
    this.updateFormControl();
    this.filteredOptions = this.filterOptions(this.searchTerm);
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private updateFormControl() {
    if (!this.formControl) return;
    if ('setValue' in this.formControl) {
      this.formControl.setValue(this.value);
      this.formControl.markAsTouched();
      this.formControl.updateValueAndValidity();
    }
  }

  onInputChange(value: string) {
    this.searchTerm = value;
    this.filteredOptions = value?.trim() ? this.filterOptions(value) : [...this.options];
  }

  filterOptions(term: string) {
    if (!term?.trim()) return [...this.options];
    return this.options.filter(o => o.label.toLowerCase().includes(term.toLowerCase()));
  }

  onOptionSelect(option: any) {
    if (this.multiple) {
      const exists = (this.value ?? []).some((o: any) => o.value === option.value);
      this.value = exists ? this.value.filter((o: any) => o.value !== option.value) : [...(this.value ?? []), option];
    } else {
      this.value = option;
    }

    this.selectionChange.emit(this.value);
    this.onChange(this.value);
    this.updateFormControl();
  }

  isSelected(option: any): boolean {
    if (this.multiple) return (this.value ?? []).some((o: any) => o.value === option.value);
    return this.value?.value === option.value;
  }

  displayFn(option: any) {
    return option?.label ?? '';
  }

  toggleDropdown(inputRef: HTMLInputElement) {
    if (this.opened) inputRef.blur();
    else inputRef.focus();
  }

  clearSelection(inputRef: HTMLInputElement) {
    this.value = this.multiple ? [] : null;
    this.selectionChange.emit(this.value);
    this.onChange(this.value);
    this.updateFormControl();
    this.searchTerm = '';
    inputRef.value = '';
    this.filteredOptions = [...this.options];
  }

  getMultipleLabel(): string {
    if (!this.value?.length) return '';
    if (this.value.length <= 2) {
      // exibe os nomes selecionados
      return this.value.map((v: any) => v.label).join(', ');
    }
    // se forem muitos, exibe "2 selecionados"
    return `${this.value.length} selecionados`;
  }

  onTouchedEvent() {
    this.onTouched();
    if (this.formControl) {
      this.formControl.markAsTouched();
    }
  }

}
