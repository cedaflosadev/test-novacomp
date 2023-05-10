import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Subject, take, takeUntil, tap } from 'rxjs';
import { Database } from 'src/app/interfaces/database.interface';
import { AppService } from 'src/app/services/app.service';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-form-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxSpinnerModule,
  ],
  templateUrl: './form-settings.component.html',
  styleUrls: ['./form-settings.component.scss'],
})
export class FormSettingsComponent implements OnInit {
  formAddTable!: FormGroup;

  fileDatabase = {} as Database;

  contentFile = '';

  unsubscribe = new Subject();

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.initFormAddTables();
    this.getContentPrismaFile();
  }

  initFormAddTables() {
    this.formAddTable = this.formBuilder.group({
      clientProvider: ['', [Validators.required]],
      datasourceProvider: ['', [Validators.required]],
      datasourcerURL: ['', [Validators.required]],
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

          const valueConfig = {
            clientProvider: this.fileDatabase.config[0].provider ?? '',
            datasourceProvider: this.fileDatabase.config[1].provider ?? '',
            datasourcerURL: this.fileDatabase.config[1].url ?? '',
          };
          this.formAddTable.setValue(valueConfig);

          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        })
      )
      .subscribe();
  }

  cancelTable() {
    this.initFormAddTables();
    this.router.navigate(['./']);
  }

  saveTable() {
    if (this.formAddTable.valid) {
      this.spinner.show(undefined, { fullScreen: true });

      this.fileDatabase.config[0].provider =
        this.formAddTable.controls['clientProvider'].value;
      this.fileDatabase.config[1].provider =
        this.formAddTable.controls['datasourceProvider'].value;
      this.fileDatabase.config[1].url =
        this.formAddTable.controls['datasourcerURL'].value;

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
