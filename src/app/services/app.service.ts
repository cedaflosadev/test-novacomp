import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
import { baseUrl, baseUrlPrisma } from '../constants/api.config';
import { Database } from '../interfaces/database.interface';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Database json server
   * @returns
   */

  getAllDatabase(): Observable<Database> {
    return this.httpClient.get<Database>(`${baseUrl}/database`);
  }

  updateDatabase(databaseUpdated: Database): Observable<Database> {
    return this.httpClient.put<Database>(
      `${baseUrl}/database`,
      databaseUpdated
    );
  }

  /**
   * Database api node js
   * @returns
   */

  buildPrismaFile(contentFile: {
    contentFile: string;
  }): Observable<{ response: boolean }> {
    return this.httpClient.post<{ response: boolean }>(
      `${baseUrlPrisma}/build-prisma-file`,
      contentFile
    );
  }

  /**
   * Utils services
   * @returns
   */

  mapContentFromDatabase(databaseContent: Database): string {
    const { config, tables } = databaseContent;
    const contentFromDatabase = `${config
      .map(
        (cfg) => `${cfg.type} ${cfg.name} {
      ${cfg.provider ? `provider = "${cfg.provider}"` : ''}
      ${cfg.url ? `url = "${cfg.url}"` : ''}
  }\n`
      )
      .join('\n')}
    ${tables
      .map(
        (table) => `${table.type} ${table.name} {
        ${table.fields
          .map(
            (field) =>
              `${field.name} ${
                field.optional ? `${field.type}?` : `${field.type}`
              } ${field.restriction}`
          )
          .join('\n')}
      }\n`
      )
      .join('\n')}
    `;

    return contentFromDatabase;
  }

  downloadPrismaFile(buildPrismaFile: string): void {
    var link = document.createElement('a');
    link.download = 'schema.prisma';
    var blob = new Blob([buildPrismaFile], { type: 'text/plain' });
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }

  buildPrismaFileHanllde(buildPrismaFile: string): void {
    this.buildPrismaFile({ contentFile: buildPrismaFile })
      .pipe(take(1))
      .subscribe();
  }
}
