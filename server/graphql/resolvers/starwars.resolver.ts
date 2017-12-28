import * as fetch from 'node-fetch';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';

import IStarwars from '../../api/interfaces/istarwars';
import { StarwarsService } from '../../api/services/starwars.service';
import { LogService } from '../../common/services/log.service';
//const StarwarsService = container.get<IStarwars>(SERVICE_IDENTIFIER.STARWARS);
const myStarwarsService = new StarwarsService(new LogService);

export default {

    RootQueryType: {
        peopleWithPlanet(parent, args, context, info) {
            return new Promise(function (resolve, reject) {
                myStarwarsService
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
