import { Pipe, PipeTransform } from '@angular/core';
import Filter from 'ansi-to-html';

@Pipe({
  name: 'ansiToHtml'
})
export class AnsiToHtmlPipe implements PipeTransform {
  private converter = new Filter({
    newline: true,
    escapeXML: true,
    colors: {
        // Você pode customizar as cores aqui se quiser ajustar para o seu tema Dark
        1: '#ff5252', // Red (Erros)
        2: '#69f0ae', // Green (Sucesso)
        3: '#ffd740', // Yellow (Avisos)
    }
  });

  transform(value: string): string {
    if (!value) return '';
    return this.converter.toHtml(value);
  }
}
