import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class PanelService {
  private config: MatDialogConfig = {
    hasBackdrop: true,
    backdropClass: 'litwo-panel-backdrop',
    panelClass: 'litwo-panel',
    disableClose: false,
    width: '300px',
    position: { left: '0' }
  };

  constructor(private dialog: MatDialog) {}

  /** Define o tamanho do painel */
  size(size: 'sm' | 'md' | 'lg' | string): this {
    const sizes: Record<string, number> = {
      xs: 100,
      sm: 200,
      md: 300,
      lg: 500,
      xl: 1000,
    };

    // Pega o valor em pixels do tamanho desejado
    const desiredWidth = sizes[size] ?? (parseInt(size, 10) || 600);

    // Calcula o máximo possível sem ultrapassar a tela
    const maxAllowed = window.innerWidth; // deixa 20px de margem de cada lado
    const finalWidth = Math.min(desiredWidth, maxAllowed);

    this.config.minWidth = finalWidth + 'px';
    this.config.width = finalWidth + 'px';
    this.config.maxWidth = maxAllowed + 'px';

    return this;
  }

  /** Define o backdrop (pode ser 'static' ou 'true/false') */
  backdrop(type: 'static' | boolean): this {
    if (type === 'static') {
      this.config.disableClose = true;
    } else {
      this.config.hasBackdrop = !!type;
    }
    return this;
  }

  /** Define de que lado o painel aparece */
  position(side: 'left' | 'right'): this {
    this.config.position = side === 'left' ? { left: '0' } : { right: '0' };
    return this;
  }

  /** Renderiza o componente dentro do painel */
  render<T>(component: Type<T>, data?: any): MatDialogRef<T> {
    const dialogRef = this.dialog.open(component, {
      ...this.config,
      data
    });

    // reset após uso, para nova chamada começar limpa
    this.config = {
      hasBackdrop: true,
      backdropClass: 'litwo-panel-backdrop',
      panelClass: 'litwo-panel',
      disableClose: false,
      width: '300px',
      position: { left: '0' }
    };

    return dialogRef;
  }
}
