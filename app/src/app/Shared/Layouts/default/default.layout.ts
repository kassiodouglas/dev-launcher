import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'layout-default',
  imports: [
    CommonModule, RouterOutlet, MatIconModule,
    MatMenuModule, RouterModule
  ],
  templateUrl: './default.layout.html'
})
export class DefaultLayout {
  sidebarOpen = true;
  isMobile = false;

  ngOnInit() {
    this.checkMobile();
  }

  @HostListener('window:resize')
  checkMobile() {
    this.isMobile = window.innerWidth < 768;

    if (this.isMobile) {
      this.sidebarOpen = false; // sidebar fechada no mobile
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSidebarDesktop() {
    if (!this.isMobile) {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }
}

