import { Container } from 'inversify';

import { HelloRouter } from '../modules/hello/hello.router';
import Router from '../helpers/router';

const container = new Container();

container.bind<HelloRouter>(HelloRouter).to(HelloRouter).inSingletonScope();

container.bind<Router>(Router).toSelf().inSingletonScope();

export { container };
