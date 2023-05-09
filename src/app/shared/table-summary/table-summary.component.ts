import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { take, tap } from 'rxjs';
import { Database, Table } from 'src/app/interfaces/database.interface';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-table-summary',
  templateUrl: './table-summary.component.html',
  styleUrls: ['./table-summary.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class TableSummaryComponent {
  @Input() formAddTable!: FormGroup;

  @Input() fileDatabase = {} as Database;

  @Input() contentFile = '';

  @Output() updateEmit = new EventEmitter<Table>();

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder
  ) {}

  initFormAddTables() {
    this.formAddTable = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['model', [Validators.required]],
      fields: this.formBuilder.array([], [Validators.required]),
    });
  }

  downloadPrismaFile(buildPrismaFile: string): void {
    this.appService.downloadPrismaFile(buildPrismaFile);
  }

  deleteTable(index: number) {
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
        })
      )
      .subscribe();
    this.initFormAddTables();
  }

  updateTable(table: Table): void {
    this.updateEmit.emit(table);
  }
}
