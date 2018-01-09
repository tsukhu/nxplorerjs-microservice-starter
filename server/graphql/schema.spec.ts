// Need to include the next line for Visual Studio Code 
// intellisense to work for jest types
import {} from 'jest';

import * as request from 'supertest';
import { graphql } from 'graphql';
import schema from './schema';
import '../common/env';


describe('Example Service Tests', () => {
/*
    let originalTimeout;
    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = Number(process.env.TIMEOUT);
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
*/
    it('should be returning a quote ', async () => {
        const query = `
        query Q {
            quoteOfTheDay
        }
      `;
        const rootValue = {};
        const result = await graphql(schema, query, rootValue);
        const { data } = result;
        expect(data.quoteOfTheDay).not.toHaveLength(0);
    });

    it('should be returning a random number > 0 ', async () => {
        const query = `
        query Q {
            random
        }
      `;
        const rootValue = {};
        const result = await graphql(schema, query, rootValue);
        const { data } = result;
        expect(data.random).toBeGreaterThan(0);
    });

    it('should be returning a starwars people result for "Luke Skywalker" ', async () => {
        const query = `
        query Q {
            people(id: 1) {
                name
            }
        }
      `;
        const expectedValue = 'Luke Skywalker';
        const rootValue = {};
        const result = await graphql(schema, query, rootValue);
        const { people } = result.data;
        expect(people.name).toEqual(expectedValue);
    });


});