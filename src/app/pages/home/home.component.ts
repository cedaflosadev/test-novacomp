import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, map, take, tap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import { University } from 'src/app/interfaces/university.interface';
import { TableSummaryComponent } from 'src/app/shared/table-summary/table-summary.component';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TableSummaryComponent,
    RouterModule,
    NgxSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  fileDatabase = {} as any;

  unsubscribe = new Subject();

  flow$!: Observable<University[]>;

  constructor(
    private spinner: NgxSpinnerService,
    private apiService: AppService
  ) {}

  ngOnInit(): void {
    this.spinner.show(undefined, { fullScreen: true });
    this.flow$ = this.apiService.getUniversityList().pipe(
      take(1),
      map((universityList: University[]) => {
        this.spinner.hide();
        this.fileDatabase = universityList;
        return universityList;
      })
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }
}
