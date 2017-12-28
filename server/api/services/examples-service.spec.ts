import { Example } from '../models/example.model';
import * as request from 'supertest';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';
import IExample from '../../api/interfaces/iexample';
import ILogger from '../../common/interfaces/ilogger';

import { ExamplesService } from '../../api/services/examples.service';
import { LogService } from '../../common/services/log.service';


let id = 0;
const examples: Example[] = [
    { id: id++, name: 'example 0' },
    { id: id++, name: 'example 1' }
  ];

describe('Example Service Tests', () => {
    let exampleService: IExample;
    beforeEach(() => {
        exampleService = new ExamplesService(new LogService);
    });
    it('Get Example array', () => {
        return exampleService
        .all()
        .then(
        result => {
          expect(result.length).toBeGreaterThanOrEqual(2);
        });
    });

    it('POST Test', () => {
       const expectedName = 'Hello World';
       return exampleService.create(expectedName)
        .then(
            result => {
                expect(result.name).toEqual(expectedName);
                return exampleService.byId(2).then ( data =>
                    expect(data.name).toEqual(expectedName)
                );
            }
        );
    });

});