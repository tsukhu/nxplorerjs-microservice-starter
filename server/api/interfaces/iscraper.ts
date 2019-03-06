import { Observable } from 'rxjs';

/**
 * StarWars Service Interface
 */
interface IScraper {
  getScrapedData(url: string): Observable<any>;
}



export default IScraper;
