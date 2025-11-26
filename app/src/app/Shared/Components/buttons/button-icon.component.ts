import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonStyles, ButtonVariant, ButtonSize, ButtonSizesCircle } from './button.styles';

@Component({
  selector: 'comp-button-icon',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button
      matIconButton
      [disabled]="disabled"
      [attr.type]="type"
      [ngClass]="[ButtonStyles[variant], ButtonSizes[size], '!flex items-center justify-center !rounded-full p-2']"
    >
      <mat-icon>{{ icon }}</mat-icon>
    </button>
  `,
})
export class ButtonIconComponent {
  @Input({required:true}) icon!: string;
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = '';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';

  ButtonStyles = ButtonStyles;

  ButtonSizes = ButtonSizesCircle;
}
