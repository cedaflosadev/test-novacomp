import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import { Database, Table } from 'src/app/interfaces/database.interface';
import { TableSummaryComponent } from 'src/app/shared/table-summary/table-summary.component';
import { FormCreatorUpdaterComponent } from 'src/app/shared/form-creator-updater/form-creator-updater.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TableSummaryComponent, FormCreatorUpdaterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  contentFile = '';

  fileDatabase = {} as Database;

  unsubscribe = new Subject();

  formAddTable!: FormGroup;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder
  ) {
    this.initFormAddTables();
  }

  ngOnInit(): void {
    this.getContentPrismaFile();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  initFormAddTables() {
    this.formAddTable = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['model', [Validators.required]],
      fields: this.formBuilder.array([], [Validators.required]),
    });
  }

  updateTable(table: Table) {
    this.initFormAddTables();
    this.formAddTable.controls['name'].setValue(table.name);
    this.formAddTable.controls['type'].setValue(table.type);

    table.fields.forEach((fieldContent) => {
      const field = this.formBuilder.group({
        name: [fieldContent.name, [Validators.required]],
        type: [fieldContent.type, [Validators.required]],
        optional: [fieldContent.optional, [Validators.required]],
        restriction: [fieldContent.restriction, []],
      });
      (this.formAddTable.controls['fields'] as FormArray).push(field);
    });
  }

  getContentPrismaFile(): void {
    this.appService
      .getAllDatabase()
      .pipe(
        takeUntil(this.unsubscribe),
        tap((databaseContent: Database) => {
          this.fileDatabase = databaseContent;
          this.contentFile = this.appService.mapContentFromDatabase(
            this.fileDatabase
          );
        })
      )
      .subscribe();
  }
}
