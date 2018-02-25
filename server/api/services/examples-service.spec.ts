import { Example } from '../models/example.model';
import * as request from 'supertest';
import container from '../../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';
import IExample from '../../api/interfaces/iexample';
import ILogger from '../../common/interfaces/ilogger';


let id = 0;
const examples: Example[] = [
    { id: id++, name: 'example 0' },
    { id: id++, name: 'example 1' }
  ];

describe('Example Service Tests', () => {
    let exampleService: IExample;
    beforeEach(() => {
        exampleService = container.get<IExample>(SERVICE_IDENTIFIER.EXAMPLE);
    });
    it('Get All elements in the example array', () => {
        return exampleService
        .all()
        .then(
        result => {
            console.log(result);
          expect(result.length).toEqual(2);
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