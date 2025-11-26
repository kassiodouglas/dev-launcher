import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'comp-code-block',
  standalone: true,
  imports: [CommonModule, HighlightModule],
  template: `
    <div class="group relative">

      <!-- Botão copiar -->
      <button
        type="button"
        (click)="copyCode()"
        class="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200
               dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 text-xs px-2 py-1 rounded-md bg-zinc-300 hover:bg-zinc-700 text-zinc-600 hover:text-white
               flex items-center gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-copy"
        >
          <rect width="8" height="8" x="8" y="8" rx="1" ry="1" />
          <path d="M4 16V4a1 1 0 0 1 1-1h11" />
        </svg>
        {{ copied ? 'Copiado!' : 'Copiar' }}
      </button>

      <!-- Bloco de código -->
      <pre class="m-0 p-1 overflow-x-auto leading-relaxed ">
        <code [highlight]="code" [language]="language"></code>
      </pre>

    </div>
  `,
})
export class CodeBlockComponent {
  @Input() code = '';
  @Input() language: 'typescript' | 'html' | 'css' | 'javascript' | 'json' =
    'typescript';

  copied = false;

  copyCode() {
    navigator.clipboard.writeText(this.code.trim()).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }
}
