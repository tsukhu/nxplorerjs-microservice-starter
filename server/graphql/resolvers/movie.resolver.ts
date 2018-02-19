import { request } from 'graphql-request';
import container from '../../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';

import ILogger from '../../common/interfaces/ilogger';

const LOG = container.get<ILogger>(SERVICE_IDENTIFIER.LOGGER);

const query = `{
  Movie(title: "Inception") {
    releaseDate
    slug
    actors {
      name
    }
  }
}`;

/**
 * Movie GraphQL resolver
 */
export default {
  RootQueryType: {
    movie: (parent, args, context, info) => {
      return Promise.resolve(
        request('https://api.graph.cool/simple/v1/movies', query).then(
          (data: any) => {
            LOG.info(data.Movie);
            return data.Movie;
          }
        )
      );
    }
  }
};
