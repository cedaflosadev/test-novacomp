import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { University } from '../interfaces/university.interface';

import { baseUrl } from '../constants/api.config';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  selectUniversity = new BehaviorSubject<University>({} as University);

  private university$ = this.selectUniversity.asObservable();

  constructor(private httpClient: HttpClient) {}

  /**
   * Api University List
   * @returns
   */

  getUniversityList(): Observable<University[]> {
    return this.httpClient.get<University[]>(
      `${baseUrl}/search?country=United+States`
    );
  }

  getUniversitySelect() {
    return this.university$;
  }

  setUniversity(university: University) {
    this.selectUniversity.next(university);
  }
}
