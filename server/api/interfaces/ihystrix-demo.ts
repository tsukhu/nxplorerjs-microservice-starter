import { Observable } from 'rxjs';

/**
 * Hystrix Service Interface
 */
interface IHystrixDemo {
  start(): Observable<Boolean>;
  getPosts(timeOut: number): Observable<any>;
}

export default IHystrixDemo;
