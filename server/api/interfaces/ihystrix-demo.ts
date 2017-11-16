import { Request, Response } from 'express';
import { Observable } from 'rxjs/Observable';

interface IHystrixDemo {
  start(): Observable<Boolean>;
  getPosts(timeOut: number): Observable<any>;
}

export default IHystrixDemo;
