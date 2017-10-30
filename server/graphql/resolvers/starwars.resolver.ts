import * as fetch from 'node-fetch';

import StarwarsService from '../../api/services/starwars.service';


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
        }
    }
};
/**
 * Starwars GraphQL resolver
 */
