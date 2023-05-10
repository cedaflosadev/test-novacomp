import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { take, tap } from 'rxjs';
import { Database } from 'src/app/interfaces/database.interface';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-table-summary',
  templateUrl: './table-summary.component.html',
  styleUrls: ['./table-summary.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxSpinnerModule],
})
export class TableSummaryComponent {
  @Input() formAddTable!: FormGroup;

  @Input() fileDatabase = {} as Database;

  @Input() contentFile = '';

  @Output() updateEmit = new EventEmitter<number>();

  showContent = false;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.showContent = true;
  }

  initFormAddTables() {
    this.formAddTable = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['model', [Validators.required]],
      fields: this.formBuilder.array([], [Validators.required]),
    });
  }

  deleteTable(index: number) {
    this.spinner.show(undefined, { fullScreen: true });
    this.fileDatabase.tables.splice(index, 1);
    this.contentFile = this.appService.mapContentFromDatabase(
      this.fileDatabase
    );
    this.appService
      .updateDatabase(this.fileDatabase)
      .pipe(
        take(1),
        tap(() => {
          this.appService.buildPrismaFileHanllde(this.contentFile);
          setTimeout(() => {
            this.spinner.hide();
            this.showContent = true;
          }, 500);
        })
      )
      .subscribe();
    this.initFormAddTables();
  }

  updateTable(id: number): void {
    this.updateEmit.emit(id);
  }

  downloadPrismaFile(): void {
    this.contentFile = this.appService.mapContentFromDatabase(
      this.fileDatabase
    );
    this.appService.downloadPrismaFile(this.contentFile);
  }
}
