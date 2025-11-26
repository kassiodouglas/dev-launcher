import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControlLabeled } from '@src/app/shared/components/formulary_old/validation/FormControlLabeled';
import { NotifyService } from '@src/app/shared/services/notiflix/notify.service';

@Injectable({
  providedIn: 'root'
})
export class FilterToolbarForm {

  private fb = inject(FormBuilder);

  public form!: FormGroup;
  public mode: 'create' | 'update' = 'create';
  public updateId: string | number | null = null;

  constructor() { this.create(); }

  public create(): void {
    this.form = this.fb.group({
      column: new FormControlLabeled('Coluna', ''),
      operator: new FormControlLabeled('Operador', ''),
      value: new FormControlLabeled('Valor', ''),
      label: new FormControlLabeled('Label', ''),
    });
  }

  public reset(): void {
    return this.form.reset();
  }

  public get values(): any {
    return this.form.value;
  }

  public get valid(): boolean {
    return this.form.valid;
  }

  public get invalid(): boolean {
    return this.form.invalid;
  }

}
