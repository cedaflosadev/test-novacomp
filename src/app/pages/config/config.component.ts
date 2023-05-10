import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableSummaryComponent } from 'src/app/shared/table-summary/table-summary.component';
import { FormCreatorUpdaterComponent } from 'src/app/shared/form-creator-updater/form-creator-updater.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Database } from 'src/app/interfaces/database.interface';
import { Subject, takeUntil, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { FormSettingsComponent } from 'src/app/shared/form-settings/form-settings.component';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    CommonModule,
    TableSummaryComponent,
    FormCreatorUpdaterComponent,
    RouterModule,
    NgxSpinnerModule,
    FormSettingsComponent,
  ],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent {
  showContent = false;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show(undefined, { fullScreen: true });
    setTimeout(() => {
      this.spinner.hide();
      this.showContent = true;
    }, 500);
  }
}
