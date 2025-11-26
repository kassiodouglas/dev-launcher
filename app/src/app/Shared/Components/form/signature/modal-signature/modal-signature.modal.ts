import { Component, ElementRef, Inject, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from "@src/app/Shared/Components/buttons/button.component";

@Component({
  selector: 'modal-signature',
  imports: [
    CommonModule,
    ButtonComponent
  ],
  templateUrl: './modal-signature.modal.html',
})
export class SignatureModal {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;

  canvasHeight = 300;

  constructor(
    // public dialogRef: MatDialogRef<FormSignatureDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: { value: string | null },
    private modal: MatDialogRef<SignatureModal>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;

    // Define dimensões internas com base no tamanho real do elemento na tela
    canvas.width = canvas.offsetWidth;
    canvas.height = this.canvasHeight; // ou use canvas.offsetHeight se quiser manter dinâmico também

    this.ctx = canvas.getContext('2d')!;
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';

    // Redesenha imagem anterior, se houver
    if (this.data.value) {
      const img = new Image();
      img.src = this.data.value;
      img.onload = () => this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    // Recalcula tamanho quando a janela for redimensionada
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    const canvas = this.canvasRef.nativeElement;

    // Salva o conteúdo atual
    const data = canvas.toDataURL();

    // Redimensiona
    const newWidth = canvas.offsetWidth;
    canvas.width = newWidth;
    canvas.height = this.canvasHeight;

    // Restaura o conteúdo antigo
    const img = new Image();
    img.src = data;
    img.onload = () => this.ctx.drawImage(img, 0, 0, newWidth, this.canvasHeight);
  }


  startDraw(event: MouseEvent | TouchEvent) {
    this.drawing = true;
    this.ctx.beginPath();
    const pos = this.getPos(event);
    this.ctx.moveTo(pos.x, pos.y);
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.drawing) return;
    const pos = this.getPos(event);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  stopDraw() {
    this.drawing = false;
  }

  clear() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  save() {
    const canvas = this.canvasRef.nativeElement;
    const image = canvas.toDataURL('image/png');
    this.modal.close(image);
  }

  private getPos(event: MouseEvent | TouchEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    if (event instanceof MouseEvent) {
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    } else {
      const touch = event.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
  }

  onCancel() {
    this.modal.close(false);
  }

  onConfirm() {
    this.modal.close(true);
  }

}
