import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';

import { University } from '../interfaces/university.interface';

import { baseUrl } from '../constants/api.config';

@Injectable({
  providedIn: 'root',
})
export class AppService {
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
}
