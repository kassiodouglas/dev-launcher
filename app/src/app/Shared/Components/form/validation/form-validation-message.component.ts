import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, OnDestroy, ElementRef } from '@angular/core';
import { ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { fromEvent, Subscription } from 'rxjs';
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'form-validation-message',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTooltip],
  styles: [`
  @keyframes scale-pop {
      0% {
        transform: scale(1);
        opacity: 0.8;
        box-shadow: 0 0 0 rgba(255, 0, 0, 0);
      }
      50% {
        transform: scale(1.15);
        opacity: 1;
        box-shadow: 0 0 12px rgba(239, 68, 68, 0.6); /* vermelho mais vibrante */
      }
      100% {
        transform: scale(1);
        opacity: 1;
        box-shadow: 0 0 0 rgba(255, 0, 0, 0);
      }
    }


    .animate-scale-pop {
      animation: scale-pop 0.35s ease-out;
    }
  `],
  template: `
    <ng-container *ngIf="control">
      <small
        [matTooltip]="message"
        *ngIf="showMessage && control.invalid && (control.touched || control.dirty)"
        [class.animate-scale-pop]="animate"
        class="truncate ... max-w-[90%] cursor-pointer opacity-95 hover:opacity-100 dark:hover:bg-danger-600 hover:bg-danger-800 hover:shadow-md dark:text-danger-300 absolute -top-2 right-0 z-40 bg-danger-400/70 font-bold text-white dark:bg-danger-900/90 badge p-1 rounded-md text-xs transition-opacity duration-300"
        (click)="hideTemporarily()"
      >
        {{ message }}
      </small>
    </ng-container>
  `,
})
export class FormValidationMessageComponent implements OnChanges, OnDestroy {
  @Input() control!: AbstractControl | null;
  @Input() fieldName?: string;

  animate = false;
  showMessage = true;
  private statusSub?: Subscription;
  private submitSub?: Subscription;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control'] && this.control) {
      this.statusSub?.unsubscribe();

      this.statusSub = this.control.statusChanges.subscribe(() => {
        if (this.control?.invalid && (this.control.touched || this.control.dirty)) {
          this.showMessage = true;
        }
      });

      this.listenToFormSubmit();
    }
  }

  private listenToFormSubmit() {
    // encontra o form mais próximo
    const form = this.el.nativeElement.closest('form');
    if (form) {
      this.submitSub?.unsubscribe();
      this.submitSub = fromEvent(form, 'submit').subscribe(() => {
        // ao submeter, se o campo ainda estiver inválido → mostrar novamente
        if (this.control?.invalid) {
          this.showMessage = true;
          this.triggerAnimation();
        }
      });
    }
  }

  hideTemporarily() {
    this.showMessage = false;
  }

  ngOnDestroy(): void {
    this.statusSub?.unsubscribe();
    this.submitSub?.unsubscribe();
  }

  private triggerAnimation() {
    this.animate = false;
    void this.el.nativeElement.offsetWidth; // força reflow (reinicia a animação)
    this.animate = true;
  }

  get message(): string | null {
    if (!this.control || !this.control.errors) return null;

    const errors = this.control.errors;

    if (errors['required']) return 'Campo obrigatório.';
    if (errors['email']) return 'E-mail inválido.';
    if (errors['minlength'])
      return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['maxlength'])
      return `Máximo de ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors['pattern']) return 'Formato inválido.';
    if (errors['min']) return `Valor mínimo permitido: ${errors['min'].min}.`;
    if (errors['max']) return `Valor máximo permitido: ${errors['max'].max}.`;

    // 🔹 Validadores customizados
    if (errors['exactLength'])
      return `O valor deve ter exatamente ${errors['exactLength'].requiredLength} caracteres (atual: ${errors['exactLength'].actualLength}).`;

    if (errors['minWords'])
      return `Informe pelo menos ${errors['minWords'].required} palavra(s).`;

    if (errors['patternInsensitive'])
      return 'O formato informado não corresponde ao esperado.';

    if (errors['minValue'])
      return `O valor mínimo permitido é ${errors['minValue'].min}.`;

    if (errors['maxValue'])
      return `O valor máximo permitido é ${errors['maxValue'].max}.`;

    if (errors['dateBefore'])
      return `A data deve ser anterior à data de ${errors['dateBefore'].earlierField}.`;

    if (errors['dateAfter'])
      return `A data deve ser posterior à data de ${errors['dateAfter'].earlierField}.`;

    if (errors['dateBeforeOrEqual'])
      return `Deve ser anterior ou igual à data de ${errors['dateBeforeOrEqual'].earlierField}.`;

    if (errors['dateAfterOrEqual'])
      return `Deve ser posteior ou igual à data de ${errors['dateAfterOrEqual'].earlierField}.`;

    if (errors['cpf'])
      return 'CPF inválido.';

    if (errors['cnpj'])
      return 'CNPJ inválido.';

    if (errors['phone'])
      return 'Telefone inválido.';

    if (errors['plate'])
      return 'Placa inválida.';

    if (errors['cep'])
      return 'CEP inválido.';

    if (errors['mustMatch'])
      return 'Os campos não coincidem.';

    // fallback genérico
    return 'Campo inválido.';
  }

}
