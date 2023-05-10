import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { take, tap } from 'rxjs';
import { Database, Table } from 'src/app/interfaces/database.interface';
import { AppService } from 'src/app/services/app.service';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-form-creator-updater',
  templateUrl: './form-creator-updater.component.html',
  styleUrls: ['./form-creator-updater.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxSpinnerModule,
  ],
})
export class FormCreatorUpdaterComponent implements OnChanges {
  @Input() formAddTable!: FormGroup;

  @Input() fileDatabase = {} as Database;

  @Input() contentFile = '';

  @Input() id = '';

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnChanges(): void {
    if (this.id && this.fileDatabase?.tables?.length) {
      this.updateTable(this.fileDatabase.tables[Number(this.id)]);
    }
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
    this.router.navigate(['./']);
  }

  saveTable() {
    this.spinner.show(undefined, { fullScreen: true });

    if (this.formAddTable.invalid) {
      return;
    }

    if (this.formAddTable.valid) {
      if (this.id) {
        this.fileDatabase.tables[Number(this.id)] = this.formAddTable.value;
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
            setTimeout(() => {
              setTimeout(() => {
                this.spinner.hide();
              }, 200);
              this.router.navigate(['./']);
            }, 800);
          })
        )
        .subscribe();
      this.initFormAddTables();
    }
  }
}
