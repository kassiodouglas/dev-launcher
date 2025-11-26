import { Injectable } from '@angular/core';
import Notiflix from 'notiflix';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  constructor() {
    // Configuração global opcional
    Notiflix.Notify.init({
      position: 'center-top',
      distance: '15px',
      borderRadius: '40px',
      timeout: 3000,
      clickToClose: true,
      pauseOnHover: true,
      showOnlyTheLastOne: false,
      fontSize: '14px',
      cssAnimationStyle: 'from-top',
      useIcon: true,
      plainText:false
    });
  }

  success(message: string, title?: string) {
    Notiflix.Notify.success(this.formatMessage(message, title));
  }

  error(message: string, title?: string) {
    Notiflix.Notify.failure(this.formatMessage(message, title));
  }

  warning(message: string, title?: string) {
    Notiflix.Notify.warning(this.formatMessage(message, title));
  }

  info(message: string, title?: string) {
    Notiflix.Notify.info(this.formatMessage(message, title));
  }

  private formatMessage(message: string, title?: string): string {
    return title ? `<strong class="text-xs">${title}</strong><br>${message}` : message;
  }
}
