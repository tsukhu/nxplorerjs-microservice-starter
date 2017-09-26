import { ExamplesService } from './examples.service';
import { Example } from '../models/example.model';
import * as request from 'supertest';

let id = 0;
const examples: Example[] = [
    { id: id++, name: 'example 0' },
    { id: id++, name: 'example 1' }
  ];

describe('Example Service Tests', () => {
    let exampleService: ExamplesService;
    beforeEach(() => {
        exampleService = new ExamplesService();
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