import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { University } from 'src/app/interfaces/university.interface';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-table-summary',
  templateUrl: './table-summary.component.html',
  styleUrls: ['./table-summary.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
})
export class TableSummaryComponent {
  @Input() fileDatabase = [] as University[];

  constructor(
    private appService: AppService,

    private spinner: NgxSpinnerService
  ) {}
}
