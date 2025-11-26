import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'comp-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextareaComponent),
      multi: true
    }
  ]
})
export class FormTextareaComponent implements ControlValueAccessor {
  @Input() label = 'Descrição';
  @Input() placeholder = '';
  @Input() rows = 3;
  @Input() disabled = false;
  @Input() textCase: 'none' | 'upper' | 'lower' | 'capitalize' = 'none';


  value = '';

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  onInputChange(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    let val = input.value;

    // 🔠 Aplica a transformação conforme o textCase
    switch (this.textCase) {
      case 'upper':
        val = val.toUpperCase();
        break;
      case 'lower':
        val = val.toLowerCase();
        break;
      case 'capitalize':
        val = val.replace(/\b\w/g, c => c.toUpperCase());
        break;
    }

    this.value = val;
    this.onChange(val);
    this.onTouched();
  }
}
