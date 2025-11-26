import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'comp-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule
  ],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDatepickerComponent),
      multi: true
    }
  ]
})
export class FormDatepickerComponent implements ControlValueAccessor {

  @Input() label = '';
  @Input() placeholder: string | null = null;
  @Input() formControl?: AbstractControl;

  @Output() valueChange = new EventEmitter<string | null>();

  /** Valor salvo no form (yyyy-MM-dd) */
  value: string | null = null;

  /** Valor mostrado no input */
  dateModel: Date | null = null;

  isDisabled = false;

  // ControlValueAccessor callbacks
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    if (!value) {
      this.value = null;
      this.dateModel = null;
      return;
    }

    if (value instanceof Date) {
      this.dateModel = value;
      this.value = this.formatDate(value);
      return;
    }

    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      this.dateModel = this.parseLocalDate(value);
      this.value = value;
      return;
    }

    this.value = null;
    this.dateModel = null;
  }


  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void { this.isDisabled = isDisabled; }

  /** Seleção no calendário */
  onDateChange(event: any) {
    let date: Date | null = null;

    if (!event.value) {
      this.dateModel = null;
      this.value = null;
      this.valueChange.emit(null);
      this.onChange(null);
      this.updateFormControl();
      return;
    }

    // Garantir que seja Date
    if (event.value instanceof Date) {
      date = event.value;
    } else {
      date = new Date(event.value);
    }

    // Se ainda não for válido → limpa
    if (isNaN(date!.getTime())) {
      this.dateModel = null;
      this.value = null;
      this.valueChange.emit(null);
      this.onChange(null);
      this.updateFormControl();
      return;
    }

    // Atualiza valores
    this.dateModel = date;
    const formatted = this.formatDate(date!);
    this.value = formatted;
    this.valueChange.emit(formatted);
    this.onChange(formatted);
    this.updateFormControl();
  }


  /** Digitação manual */
  onInputChange(event: any) {
    const inputValue = event.target.value?.trim();
    if (!inputValue) {
      this.dateModel = null;
      this.value = null;
      this.valueChange.emit(null);
      this.onChange(null);
      this.updateFormControl();
      return;
    }

    // Formato dd/MM/yyyy
    const match = inputValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) {
      this.valueChange.emit(null);
      this.onChange(null);
      return;
    }

    const [_, day, month, year] = match;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));

    if (isNaN(parsed.getTime())) {
      this.valueChange.emit(null);
      this.onChange(null);
      return;
    }

    this.dateModel = parsed;
    const formatted = this.formatDate(parsed);
    this.value = formatted;

    this.valueChange.emit(formatted);
    this.onChange(formatted);
    this.updateFormControl();
  }

  /** Atualiza o formControl externo, se houver */
  private updateFormControl() {
    if (!this.formControl) return;
    this.formControl.setValue(this.value, { emitEvent: false });
    this.formControl.markAsTouched();
    this.formControl.updateValueAndValidity({ emitEvent: false });
  }

  /** Marca como tocado */
  onTouchedEvent() {
    this.onTouched();
    if (this.formControl) this.formControl.markAsTouched();
  }

  /** Formata para yyyy-MM-dd */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    return `${year}-${month}-${day}`;
  }

  /** Converte yyyy-MM-dd para Date local */
  private parseLocalDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

}
