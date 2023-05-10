import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Database } from 'src/app/interfaces/database.interface';
import { Subject, takeUntil, tap } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableSummaryComponent } from 'src/app/shared/table-summary/table-summary.component';
import { FormCreatorUpdaterComponent } from 'src/app/shared/form-creator-updater/form-creator-updater.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    TableSummaryComponent,
    FormCreatorUpdaterComponent,
    RouterModule,
    NgxSpinnerModule,
  ],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  contentFile = '';

  fileDatabase = {} as Database;

  unsubscribe = new Subject();

  formAddTable!: FormGroup;

  idToEdit = '';

  showContent = false;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.initFormAddTables();
  }

  ngOnInit(): void {
    this.spinner.show(undefined, { fullScreen: true });
    this.getContentPrismaFile();
    this.route.params
      .pipe(
        takeUntil(this.unsubscribe),
        tap((params) => {
          this.idToEdit = params['id'];
        })
      )
      .subscribe();
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
          setTimeout(() => {
            this.spinner.hide();
            this.showContent = true;
          }, 500);
        })
      )
      .subscribe();
  }
}
