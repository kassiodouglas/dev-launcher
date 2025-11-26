import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@core/Services/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template:`
  <router-outlet></router-outlet>`,
})
export class AppComponent {

  private themeService = inject(ThemeService);

  ngOnInit(){
    // Carrega o tema salvo ou usa o padrão
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    this.themeService.initializeTheme(savedTheme || 'dark');
  }
}
