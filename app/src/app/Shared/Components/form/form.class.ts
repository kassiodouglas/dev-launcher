import { FormBuilder, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Classe base para padronizar criação e manipulação de formulários
 * ---------------------------------------------------------------
 * Exemplo de uso:
 *
 * export class UserForm extends FormClass {
 *   constructor(override fb: FormBuilder) {
 *     super(fb);
 *     this.createForm({
 *       name: ['', Validators.required],
 *       email: ['', [Validators.required, Validators.email]],
 *     });
 *   }
 *
 *   override onSubmit() {
 *     console.log('Dados enviados:', this.values());
 *   }
 * }
 */
export abstract class FormClass {
  form!: FormGroup;
  submitted = false;
  loading = false;

  constructor(protected fb: FormBuilder) {}

  /** Cria o formulário a partir de um objeto de controles */
  protected createForm(controls: Record<string, any>, validators:any = {}): void {
    this.form = this.fb.group(controls,validators);
  }

  /** Retorna o formulário */
  get getForm(): FormGroup {
    return this.form;
  }

  /** Retorna os controles */
  get controls(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /** Retorna os valores do formulário */
  values(): any {
    return this.form.getRawValue();
  }

  /** Define valores */
  patch(data: any): void {
    if (this.form) this.form.patchValue(data);
    else console.log('Form patch: form não iniciado')

  }

  /** Reseta o formulário */
  reset(): void {
    this.form.reset();
    this.submitted = false;
  }

  /** Submissão padrão (chamada manual ou via (ngSubmit)) */
  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.onInvalid();
      return;
    }
    this.onSubmit();
  }

  /** Exibe erros no console (modo debug) */
  debug(): void {
    console.log('📋 Form Debug:', {
      values: this.values(),
      valid: this.form.valid,
      errors: this.collectErrors(),
    });
  }

  /** Método abstrato para implementação customizada de submit */
  abstract onSubmit(): void;

  /** Chamado automaticamente quando form inválido no submit() */
  protected onInvalid(): void {
    console.warn('⚠️ Formulário inválido', this.collectErrors());
  }

  /** Verifica se um campo é inválido e foi tocado */
  isInvalid(controlName: string): boolean {
    const control = this.controls[controlName];
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  /** Retorna erros de todos os campos */
  protected collectErrors(): Record<string, ValidationErrors | null> {
    const errors: Record<string, ValidationErrors | null> = {};
    Object.keys(this.controls).forEach((key) => {
      errors[key] = this.controls[key].errors || null;
    });
    return errors;
  }

  /** Desabilita o formulário */
  disable(): void {
    this.form.disable();
  }

  /** Habilita o formulário */
  enable(): void {
    this.form.enable();
  }

  /** Inicia modo loading (ex: envio de dados) */
  startLoading(): void {
    this.loading = true;
    this.form.disable();
  }

  /** Finaliza modo loading */
  stopLoading(): void {
    this.loading = false;
    this.form.enable();
  }
}
