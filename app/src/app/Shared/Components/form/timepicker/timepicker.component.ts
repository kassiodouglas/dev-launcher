import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'comp-timepicker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTimepickerComponent),
      multi: true,
    },
  ],
})
export class FormTimepickerComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() label = 'Hora';
  @Input() placeholder = 'HH:mm';
  @Input() interval = 60; // minutos (ex: 15, 30)
  @Input() disabled = false;

  @Output() selectionChange = new EventEmitter<string>(); // 'HH:mm'

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  // representação interna
  public value: string = ''; // 'HH:mm'
  public inputText = ''; // texto exibido/digitado no input
  public options: string[] = []; // array de 'HH:mm'
  public filteredOptions: string[] = [];
  public panelOpen = false;

  // ControlValueAccessor
  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.buildOptions();
    this.filteredOptions = [...this.options];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['interval'] && !changes['interval'].firstChange) {
      this.buildOptions();
      this.filterOptions(this.inputText);
    }
    if (changes['disabled']) {
      // nothing else required, template reads [disabled]="disabled"
    }
  }

  // ---- generate times ----
  private buildOptions() {
    const step = Math.max(1, Math.floor(Number(this.interval) || 30));
    const list: string[] = [];
    const minutesInDay = 24 * 60;
    for (let m = 0; m < minutesInDay; m += step) {
      list.push(this.formatMinutesToHHMM(m));
    }
    this.options = list;
  }

  private formatMinutesToHHMM(totalMinutes: number) {
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  }

  // ---- ControlValueAccessor methods ----
  writeValue(obj: any): void {
    if (typeof obj === 'string') {
      this.value = obj;
      this.inputText = obj;
    } else {
      this.value = '';
      this.inputText = '';
    }
    // keep filter in sync
    this.filterOptions(this.inputText);
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

  // ---- input interactions ----
  onInput(value: string) {
    this.inputText = value ?? '';
    this.filterOptions(this.inputText);
    // if user typed exact match, propagate immediately
    if (this.optionsIncludes(this.inputText)) {
      this.selectValue(this.inputText);
    } else {
      // user is typing; don't call onChange yet (until selection or blur)
    }
  }

  private optionsIncludes(v: string) {
    return this.options.indexOf(v) !== -1;
  }

  filterOptions(term: string) {
    const t = (term ?? '').toLowerCase();
    if (!t) {
      this.filteredOptions = [...this.options];
      return;
    }
    this.filteredOptions = this.options.filter((o) => o.includes(t));
  }

  onOptionSelected(value: string) {
    this.selectValue(value);
    // close panel (autocomplete will close automatically when option selected)
  }

  private selectValue(value: string) {
    this.value = value;
    this.inputText = value;
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
  }

  // called on blur: if typed a valid option -> accept, else clear or keep typed?
  onBlur() {
    // if typed exact match, keep; otherwise reset inputText to selected value
    if (this.value && this.optionsIncludes(this.inputText)) {
      // accepted
      // ensure propagation
      this.selectValue(this.inputText);
    } else {
      // revert input to last selected value
      this.inputText = this.value || '';
    }
  }

  // keyboard helpers (open panel)
  openPanel(inputEl: HTMLInputElement) {
    if (this.disabled) return;
    inputEl.focus();
    this.autocompleteTrigger?.openPanel();
  }

  handleKeyDown(ev: KeyboardEvent) {
    // when user presses Enter and a single filtered option exists, select it
    if (ev.key === 'Enter' && this.filteredOptions.length === 1) {
      ev.preventDefault();
      this.selectValue(this.filteredOptions[0]);
      this.autocompleteTrigger?.closePanel();
    }
  }

  displayFn(option: string): string {
    return option;
  }
}
