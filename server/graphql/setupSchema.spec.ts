// Need to include the next line for Visual Studio Code
// intellisense to work for jest types
import { graphql } from 'graphql';

import '../common/env';
import { fetchPeople } from './dataloader/starwars';
import { setupSchema } from './setupSchema';

const DataLoader = require('dataloader');

describe('Example Service Tests', () => {
  const testTimeOut = +process.env.TEST_TIMEOUT;
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
      const result = await graphql(
        setupSchema(),
        query,
        rootValue,
        contextValue
      );
      const { people } = result.data;
      expect(people.name).toEqual(expectedValue);
    },
    testTimeOut
  );
});
