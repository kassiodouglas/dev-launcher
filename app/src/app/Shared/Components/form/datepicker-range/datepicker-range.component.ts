import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'comp-datepicker-range',
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
  templateUrl: './datepicker-range.component.html',
  styleUrls: ['./datepicker-range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDatepickerRangeComponent),
      multi: true
    }
  ]
})
export class FormDatepickerRangeComponent implements ControlValueAccessor {
  @Input() label = 'Período';
  @Input() placeholderStart = 'Data início';
  @Input() placeholderEnd = 'Data fim';
  @Input() formControl?: AbstractControl;

  @Output() valueChange = new EventEmitter<{ start: Date | null; end: Date | null }>();

  value: { start: Date | null; end: Date | null } = { start: null, end: null };
  isDisabled = false;

  // ControlValueAccessor
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    if (!value || typeof value !== 'object') {
      this.value = { start: null, end: null };
    } else {
      this.value = {
        start: value.start ?? null,
        end: value.end ?? null
      };
    }
    this.updateFormControl();
  }


  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onDateChange(range: { start: Date | null; end: Date | null }) {
    this.value = range;
    this.valueChange.emit(this.value);
    this.onChange(this.value);
    this.updateFormControl();
  }

  private updateFormControl() {
    if (!this.formControl) return;
    if ('setValue' in this.formControl) {
      this.formControl.setValue(this.value);
      this.formControl.markAsTouched();
      this.formControl.updateValueAndValidity();
    }
  }

  onStartDateChange(event: any) {
    this.value.start = event.value;
    this.emitValue();
  }

  onEndDateChange(event: any) {
    this.value.end = event.value;
    this.emitValue();
  }

  private emitValue() {
    this.valueChange.emit(this.value);
    this.onChange(this.value);
    this.updateFormControl();
  }

}
