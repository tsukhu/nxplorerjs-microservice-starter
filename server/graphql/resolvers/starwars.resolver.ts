import * as fetch from 'node-fetch';
import container from '../../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';

import IStarwars from '../../api/interfaces/istarwars';

const StarwarsService = container.get<IStarwars>(SERVICE_IDENTIFIER.STARWARS);


export default {

    RootQueryType: {
        peopleWithPlanet(parent, args, context, info) {
            return new Promise(function (resolve, reject) {
                StarwarsService
                    .getPeopleById(args.id)
                    .timeout(+process.env.TIME_OUT)
                    .subscribe(r => {
                        resolve(r);
                    },
                    error => {
                        reject(error);
                    }
                    );
            }
            );
        },
        people(parent, args, context, info) {
            const URI = 'http://swapi.co/api/people/' + args.id;
            return fetch(URI).then(res => res.json());
        },
        planet(parent, args, context, info) {
            const URI = 'http://swapi.co/api/planets/' + args.id;
            return fetch(URI).then(res => res.json());
        },
        starship(parent, args, context, info) {
            const URI = 'http://swapi.co/api/starships/' + args.id;
            return fetch(URI).then(res => res.json());
        }
    }
};
/**
 * Starwars GraphQL resolver
 */
