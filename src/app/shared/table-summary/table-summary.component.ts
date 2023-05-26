import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { University } from 'src/app/interfaces/university.interface';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-table-summary',
  templateUrl: './table-summary.component.html',
  styleUrls: ['./table-summary.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, RouterModule],
})
export class TableSummaryComponent {
  @Input() fileDatabase = [] as University[];

  constructor(private appService: AppService, private router: Router) {}

  goToDetails(field: University) {
    this.appService.setUniversity(field);
    this.router.navigate(['/detail']);
  }
}
