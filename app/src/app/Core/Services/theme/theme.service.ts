import { Injectable, inject } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private defaultTheme:'light' | 'dark' = 'dark';
  private htmlTag!: HTMLElement;

  constructor() {
    // Executa após DOM estar disponível
    if (typeof window !== 'undefined') {
      this.htmlTag = document.querySelector('html')!;
    }
  }

  initializeTheme(defaultTheme: 'light' | 'dark' = 'dark') {
    this.defaultTheme = defaultTheme || this.defaultTheme;
    this.applyTheme(this.theme);
  }

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: string) {
    if (theme === 'dark') {
      this.htmlTag.classList.add('dark');
    } else {
      this.htmlTag.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }

  get theme(): 'light' | 'dark' {
    const stored = localStorage.getItem('theme');
    return stored === 'light' || stored === 'dark' ? stored : this.defaultTheme;
  }

  set theme(value: 'light' | 'dark') {
    localStorage.setItem('theme', value);
    this.applyTheme(value);
  }
}

