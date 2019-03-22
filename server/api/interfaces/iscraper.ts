import { Observable } from 'rxjs';
import ScrapeData from './scrape-data';
/**
 * StarWars Service Interface
 */
interface IScraper {
  getAll(): Observable<any>;
  getAllSites(): Observable<any>;
  getScrapedData(url: string): Observable<any>;

  getScrapedListData(scrapeInfo: ScrapeData): Observable<any>;

  push(name: string, data: string, theme: string, country: string): Observable<any>;
  pushSite(name: string, data: string): Observable<any>;

  byMicrositeByID(name: string): Observable<any>;

  byPublishedMicrositeByID(name: string): Observable<any>;
}

export default IScraper;
