import { Container, inject, interfaces } from 'inversify';
import "reflect-metadata";
import {
  autoProvide,
  makeProvideDecorator,
  makeFluentProvideDecorator
} from 'inversify-binding-decorators';

let iocContainer = new Container();

let provide = makeProvideDecorator(iocContainer);
let fluentProvider = makeFluentProvideDecorator(iocContainer);

let provideNamed = function(
  identifier:
    | string
    | symbol
    | interfaces.Newable<any>
    | interfaces.Abstract<any>,
  name: string
) {
  return fluentProvider(identifier)
    .whenTargetNamed(name)
    .done();
};


let provideSingleton = function(
  identifier:
    | string
    | symbol
    | interfaces.Newable<any>
    | interfaces.Abstract<any>
) {
  return fluentProvider(identifier)
    .inSingletonScope()
    .done();
};

export {
  iocContainer,
  autoProvide,
  provide,
  provideSingleton,
  provideNamed,
  inject
};
