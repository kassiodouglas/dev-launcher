import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'page-error',
  imports: [CommonModule, RouterModule],
  templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit {

  errorCode: string | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.errorCode = this.route.snapshot.paramMap.get('errorCode');
    this.setErrorMessage();
  }

  setErrorMessage(): void {
    switch (this.errorCode) {
      case '404':
        this.errorMessage = 'Página não encontrada!';
        break;
      case '401':
        this.errorMessage = 'Usuário não autenticado!';
        break;
      case '403':
        this.errorMessage = 'Sem permissão de acesso';
        break;
      case '405':
        this.errorMessage = 'Método não permitido!';
        break;
      case '409':
        this.errorMessage = 'Conflito de dados!';
        break;
      case '505':
        this.errorMessage = 'Erro interno no servidor!';
        break;
      default:
        this.errorMessage = 'Erro desconhecido!';
        break;
    }
  }

}
