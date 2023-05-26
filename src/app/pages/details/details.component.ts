import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import { University } from 'src/app/interfaces/university.interface';
import { Observable, map, take } from 'rxjs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, RouterModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  universitySelect: University = {} as University;

  constructor(private appService: AppService, private router: Router) {}

  flow$!: Observable<University>;

  ngOnInit(): void {
    this.flow$ = this.appService.getUniversitySelect().pipe(
      take(1),
      map((universitySelectd: University) => {
        this.universitySelect = universitySelectd;
        if (!this.universitySelect?.name) {
          this.router.navigate(['/']);
        }
        return universitySelectd;
      })
    );
  }
}
