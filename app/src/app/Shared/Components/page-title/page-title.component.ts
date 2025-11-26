import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'comp-page-title',
  imports:[
    CommonModule,
    MatIconModule
  ],
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent {

  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() showBackButton: boolean = true;

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
