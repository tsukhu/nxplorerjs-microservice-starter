import { tester } from 'graphql-tester';
import * as _ from 'lodash';
import '../../common/env';

describe('StarWars API Test', () => {
  const self = this;
  beforeAll(() => {
    self.test = tester({
      url: `http://127.0.0.1:3000/graphql`,
      contentType: 'application/json'
    });
  });

  it('should return list of people by id', done => {
    self
      .test(
        JSON.stringify({
          query: `query {
            people(id: 1) {
              name
              gender
            }
          }`
        }),
        { jar: true },
        `${process.env.TEST_TIMEOUT}`
      )
      .then(res => {
        console.log(res.data.people);
        expect(res.data.people.name).toBe('Luke Skywalker');
        expect(res.data.people.gender).toBe('male');
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

  it('should return list of planet by id', done => {
    self
      .test(
        JSON.stringify({
          query: `query {
            planet(id: 1) {
              name
              population
            }
          }`
        }),
        { jar: true },
        `${process.env.TEST_TIMEOUT}`
      )
      .then(res => {
        console.log(res.data.planet);
        expect(res.data.planet.name).toBe('Tatooine');
        expect(res.data.planet.population).toBe('200000');
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
});
