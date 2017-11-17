import { Observable } from 'rxjs';
import { People } from '../models/starwars.model';

interface IStarWars {

  getPeopleById(id: number): Observable<People>;

}

export default IStarWars;
