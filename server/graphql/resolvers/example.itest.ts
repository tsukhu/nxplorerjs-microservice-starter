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
    }`}),
        { jar: true }
      )
      .then(res => {
        const examplesArray: Array<any> = res.data.examples;
        expect(_.filter(examplesArray, { 'id': 0, 'name': 'example 0' }).length).toBe(1);
        expect(res.status).toBe(200);
        expect(res.success).toBe(true);
        done();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBe(null);
        done();
      });
  });
});
