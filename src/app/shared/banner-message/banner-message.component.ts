import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner-message.component.html',
  styleUrls: ['./banner-message.component.scss'],
})
export class BannerMessageComponent {
  @Input() message = '';
  @Input() type = '';
}
