import * as fetch from 'node-fetch';
import container from '../../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';

import IStarwars from '../../api/interfaces/istarwars';

const StarwarsService = container.get<IStarwars>(SERVICE_IDENTIFIER.STARWARS);

/**
 * Data Loader function for fetching People with planet information
 * @param id people id
 */
export const fetchPeopleWithPlanet = id => {
  return new Promise((resolve, reject) => {
    StarwarsService.getPeopleById(id)
      .timeout(+process.env.TIME_OUT)
      .subscribe(
        r => {
          resolve(r);
        },
        error => {
          reject(error);
        }
      );
  });
};

/**
 * Data Loader function for fetching People
 * @param id people id
 */
export const fetchPeople = id => {
  const URI = 'http://swapi.co/api/people/' + id;
  return fetch(URI).then(res => res.json());
};

/**
 * Data Loader function for fetching Planet
 * @param id planet id
 */
export const fetchPlanet = id => {
  const URI = 'http://swapi.co/api/planets/' + id;
  return fetch(URI).then(res => res.json());
};

/**
 * Data Loader function for fetching Starship
 * @param id starship id
 */
export const fetchStarship = id => {
  const URI = 'http://swapi.co/api/starships/' + id;
  return fetch(URI).then(res => res.json());
};
