import { Injectable, Type, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private dialog = inject(MatDialog);

  // Configurações padrão
  private config: MatDialogConfig = {
    disableClose: false,
    width: '600px',
    data: {},
  };

  /** Define o comportamento do backdrop (padrão: 'default') */
  backdrop(type: 'static' | 'default' = 'default'): this {
    this.config.disableClose = type === 'static';
    return this;
  }

  /** Define o tamanho do modal */
  size(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string): this {
    const sizes: Record<string, number> = {
      xs: 250,
      sm: 400,
      md: 600,
      lg: 900,
      xl: 1200,
    };

    // Pega o valor em pixels do tamanho desejado
    const desiredWidth = sizes[size] ?? (parseInt(size, 10) || 600);

    // Calcula o máximo possível sem ultrapassar a tela
    const maxAllowed = window.innerWidth - 40; // deixa 20px de margem de cada lado
    const finalWidth = Math.min(desiredWidth, maxAllowed);

    this.config.minWidth = finalWidth + 'px';
    this.config.width = finalWidth + 'px';
    this.config.maxWidth = maxAllowed + 'px';

    return this;
  }


  /** Define os dados passados ao componente */
  data(data: any): this {
    this.config.data = data;
    return this;
  }

  /** Renderiza o modal e retorna o reference */
  render<T>(component: Type<T>) {
    const dialogRef = this.dialog.open(component, this.config);
    this.reset(); // reseta a config para próxima chamada
    return dialogRef;
  }

  /** Reseta configurações após uso */
  private reset() {
    this.config = {
      disableClose: false,
      width: '600px',
      data: {},
    };
  }
}
