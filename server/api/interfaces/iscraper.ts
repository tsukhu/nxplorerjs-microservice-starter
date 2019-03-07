import { Observable } from 'rxjs';

/**
 * StarWars Service Interface
 */
interface IScraper {
  getScrapedData(url: string): Observable<any>;

  getScrapedListData(asinList: string): Observable<any>;

  push(name: string, data: string): Observable<any>;

  byMicrositeByID(name: string): Observable<any>;
}

export default IScraper;
