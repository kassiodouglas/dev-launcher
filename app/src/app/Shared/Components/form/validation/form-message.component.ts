

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'form-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if(form.invalid && form.touched) {
      <div class="px-5 text-center min-h-[40px] items-center flex text-sm bg-danger-800 text-danger-100 dark:bg-danger-900 dark:text-danger-100 rounded-md py-1 shadow-md animate-pulse">
        ⚠️ Corrija os campos destacados antes de enviar.
      </div>
    }
  `,
})
export class FormMessageComponent {
  @Input({required:true}) form!:FormGroup<any>;
  @Input() message = "Corrija os campos destacados antes de enviar.";
}
