import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'comp-inputy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    NgxMaskDirective,
  ],
  templateUrl: './inputy.component.html',
  styleUrls: ['./inputy.component.scss'],
  providers: [
    provideNgxMask(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputyComponent),
      multi: true,
    },
  ],
})
export class FormInputyComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() type: string = 'text';
  @Input() textCase: 'none' | 'upper' | 'lower' | 'capitalize' = 'none';

  // 💡 Nova prop: tipo de máscara
  @Input() maskType?: 'cpf' | 'cnpj' | 'phone' | 'celular' | 'money' | 'plate' | 'custom';
  @Input() maskPattern?: string; // se for 'custom'


  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  value: string = '';
  isFocused = false;

  // --- Métodos padrão do ControlValueAccessor ---
  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.value = '';
      return;
    }

    // 💰 Se for money, converter 1008.52 → "1.008,52"
    if (this.maskType === 'money') {
      const num = typeof value === 'number' ? value : parseFloat(value);
      if (!isNaN(num)) {
        this.value = num
          .toFixed(2)                     // força 2 casas
          .replace('.', ',')              // troca ponto por vírgula
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // adiciona separador de milhar
      } else {
        this.value = '';
      }
    } else {
      this.value = value;
    }

    // Força atualização visual
    setTimeout(() => {
      if (this.inputEl?.nativeElement) {
        const input = this.inputEl.nativeElement;
        input.value = this.value;
        input.dispatchEvent(new Event('input'));
      }
    });
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



  // --- Eventos de input ---
  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
    this.onTouched();
  }

  onInput(event: any) {
    let val = event.target.value;

    switch (this.textCase) {
      case 'upper': val = val.toUpperCase(); break;
      case 'lower': val = val.toLowerCase(); break;
      case 'capitalize': val = val.replace(/\b\w/g, (c: string) => c.toUpperCase()); break;
    }

    if (this.maskType === 'money') {
      // Remove R$, pontos e substitui vírgula por ponto
      const numeric = val
        .replace(/[R$\s.]/g, '') // remove R$, espaço e pontos
        .replace(',', '.');      // troca vírgula por ponto

      this.value = val;
      this.onChange(parseFloat(numeric));
      return;
    }

    // 📌 CPF, CNPJ, PHONE, CELULAR → remover tudo que não for dígito
    if (['cpf', 'cnpj', 'phone', 'celular'].includes(this.maskType!)) {
      const cleaned = val.replace(/\D/g, '');
      this.value = val;
      this.onChange(cleaned);
      return;
    }


    // 🚘 PLACA → deixar somente letras + números
    if (this.maskType === 'plate') {
      const cleaned = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      this.value = val;
      this.onChange(cleaned);
      return;
    }

    // 🧱 CUSTOM → remover caracteres especiais padrões
    if (this.maskType === 'custom') {
      const cleaned = val.replace(/[^A-Za-z0-9]/g, '');
      this.value = val;
      this.onChange(cleaned);
      return;
    }


    this.value = val;
    this.onChange(val);
  }


  getMask(): string | undefined {
    switch (this.maskType) {
      case 'cpf': return '000.000.000-00';
      case 'cnpj': return '00.000.000/0000-00';
      case 'phone': return '(00) 0000-0000||(00) 00000-0000';
      case 'money':
        this.textCase = 'upper';
        return 'separator.2';
        break
      case 'plate':
        this.textCase = 'upper';
        return 'AAAAAAA||0000000';
        break;
      case 'custom': return this.maskPattern;
      default: return undefined;
    }
  }

  getPrefix(): string {
    switch (this.maskType) {
      case 'money': return 'R$ ';
      default: return '';
    }
  }


}
