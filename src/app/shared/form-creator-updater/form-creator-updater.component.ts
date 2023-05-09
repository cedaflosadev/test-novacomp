import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { take, tap } from 'rxjs';
import { Database } from 'src/app/interfaces/database.interface';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-form-creator-updater',
  templateUrl: './form-creator-updater.component.html',
  styleUrls: ['./form-creator-updater.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class FormCreatorUpdaterComponent {
  @Input() formAddTable!: FormGroup;

  @Input() fileDatabase = {} as Database;

  @Input() contentFile = '';

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

  get fieldsByTable() {
    return this.formAddTable.controls['fields'] as FormArray;
  }

  addField() {
    const field = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      optional: [false, [Validators.required]],
      restriction: ['', []],
    });

    (this.formAddTable.controls['fields'] as FormArray).push(field);
  }

  deleteField(fieldIndex: number) {
    (this.formAddTable.controls['fields'] as FormArray).removeAt(fieldIndex);
  }

  cancelTable() {
    this.initFormAddTables();
  }

  saveTable() {
    if (this.formAddTable.valid) {
      const tableCreatedId = this.fileDatabase.tables.findIndex(
        (table) => table.name === this.formAddTable.controls['name'].value
      );

      if (tableCreatedId !== -1) {
        this.fileDatabase.tables[tableCreatedId] = this.formAddTable.value;
      } else {
        this.fileDatabase.tables.push(this.formAddTable.value);
      }

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
  }
}
