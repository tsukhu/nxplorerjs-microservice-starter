// Need to include the next line for Visual Studio Code
// intellisense to work for jest types
import {} from 'jest';

import * as request from 'supertest';
import { graphql } from 'graphql';
import { setupSchema } from './schema';
const DataLoader = require('dataloader');
import {
  fetchPeopleWithPlanet,
  fetchPeople,
  fetchPlanet,
  fetchStarship
} from './dataloader/starwars';
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
    const result = await graphql(setupSchema(), query, rootValue);
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
    const result = await graphql(setupSchema(), query, rootValue);
    const { data } = result;
    expect(data.random).toBeGreaterThan(0);
  });

  it(
    'should be returning a starwars people result for "Luke Skywalker" ',
    async () => {
      const query = `
        query Q {
            people(id: 1) {
                name
            }
        }
      `;
      const expectedValue = 'Luke Skywalker';
      const rootValue = {};
      const peopleLoader = new DataLoader(keys =>
        Promise.all(keys.map(fetchPeople))
      );
      const contextValue = {
        peopleLoader
      };
      const result = await graphql(setupSchema(), query, rootValue, contextValue);
      const { people } = result.data;
      expect(people.name).toEqual(expectedValue);
    },
    10000
  );
});
