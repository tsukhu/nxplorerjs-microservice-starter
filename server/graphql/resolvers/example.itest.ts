// Need to include the next line for Visual Studio Code
// intellisense to work for jest types
import {} from 'jest';

import { tester } from 'graphql-tester';
import * as _ from 'lodash';
import '../../common/env';

describe('Example Resolver Tests', () => {
  const self = this;
  beforeAll(() => {
    self.test = tester({
      url: `http://127.0.0.1:3000/graphql`,
      contentType: 'application/json'
    });
  });

  it('should return list of examples', done => {
    self
      .test(
        JSON.stringify({
          query: `query {
      examples {
        id
        name
      }
    }`
        }),
        { jar: true }
      )
      .then(res => {
        const examplesArray: Array<any> = res.data.examples;
        expect(
          _.filter(examplesArray, data => {
            return _.includes(['example 0'], data.name);
          }).length
        ).toBe(1);
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        done();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBe(undefined);
        done();
      });
  });

  it('should return example based on id', done => {
    self
      .test(
        JSON.stringify({
          query: `query {
      example(id: 1) {
        id
        name
      }
    }`
        }),
        { jar: true }
      )
      .then(res => {
        expect(res.data.example.name).toBe('example 1');
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        done();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBe(undefined);
        done();
      });
  });

  it('should return error based on invalid id', done => {
    self
      .test(
        JSON.stringify({
          query: `query {
      example(id: 11) {
        id
        name
      }
    }`
        }),
        { jar: true }
      )
      .then(res => {
        expect(res.data.example).toBeNull();
        done();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBe(undefined);
        done();
      });
  });
});
