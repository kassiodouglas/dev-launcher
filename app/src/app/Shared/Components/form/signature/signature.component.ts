import { Component, Input, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { SignatureModal } from './modal-signature/modal-signature.modal';
import { ModalService } from '@src/app/Shared/Services/modal.service';

@Component({
  selector: 'comp-signature',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSignatureComponent),
      multi: true,
    },
  ],
})
export class FormSignatureComponent implements ControlValueAccessor {
  private modal = inject(ModalService);

  @Input() label = 'Assinatura';
  @Input() disabled = false;

  value: string | null = null; // base64 da assinatura

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: string | null): void {
    this.value = value;
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

  openSignatureModal() {
    if (this.disabled) return;

    const modal = this.modal.backdrop('static').size('xl').render(SignatureModal)

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.value = result;
        this.onChange(this.value);
        this.onTouched();
      }
    });
  }

  clearSignature() {
    this.value = null;
    this.onChange(this.value);
  }
}
