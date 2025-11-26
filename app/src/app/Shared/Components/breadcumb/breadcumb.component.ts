import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
  selector: 'comp-breadcumb',
  imports:[
    CommonModule,
    RouterModule
  ],
  templateUrl: './breadcumb.component.html',
  styleUrl: './breadcumb.component.scss',
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
