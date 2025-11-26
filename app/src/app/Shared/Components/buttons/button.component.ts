import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, HostListener, Input, Output, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonSize, ButtonSizes, ButtonStyles, ButtonVariant } from './button.styles';

export type ButtonGroup = 'right' | 'middle' | 'left' | '';

@Component({
  selector: 'comp-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button
      matButton="elevated"
      [disabled]="disabled"
      [attr.type]="type"
      [ngClass]="[ButtonStyles[variant], ButtonSizes[size], ButtonRounds[group] , 'w-full disabled:opacity-40 !flex !items-center !justify-center disabled:cursor-not-allowed disabled:pointer-events-none']"
    >
      @if(icon){
        <mat-icon>{{ icon }}</mat-icon>
      }
      <ng-content>
      </ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() icon!: string;
  @Input() size: ButtonSize = '';
  @Input() group: ButtonGroup = '';

  ButtonStyles = ButtonStyles;
  ButtonSizes = ButtonSizes;

  ButtonRounds: Record<ButtonGroup, string> = {
    '': '!rounded-full',
    right: '!rounded-none !rounded-r-full',
    middle: '!rounded-none',
    left: '!rounded-none !rounded-l-full',
  };

  // adiciona style pointer-events:none no elemento <comp-button> quando disabled
  @HostBinding('style.pointerEvents') get hostPointerEvents() {
    return this.disabled ? 'none' : null;
  }

  // opcional: marcam como não interativo para acessibilidade
  @HostBinding('attr.aria-disabled') get hostAriaDisabled() {
    return this.disabled ? 'true' : null;
  }



}
