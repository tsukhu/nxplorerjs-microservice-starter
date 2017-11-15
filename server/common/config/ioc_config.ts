import 'reflect-metadata';

import { Container } from 'inversify';

import LogService from '../services/log-service';
import SERVICE_IDENTIFIER from '../constants/identifiers';
import TAG from '../constants/tags';

import ILogger from '../interfaces/ilogger';

const container = new Container();

container.bind<ILogger>(SERVICE_IDENTIFIER.LOGGER).to(LogService).inSingletonScope();

export default container;
