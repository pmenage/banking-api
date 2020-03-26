import { Container } from 'inversify';

import DatabaseProvider from './database-provider';
import { HelloRouter } from '../modules/banking/hello.router';
import Router from '../helpers/router';

const container = new Container();

container.bind<DatabaseProvider>(DatabaseProvider).to(DatabaseProvider).inSingletonScope();

container.bind<HelloRouter>(HelloRouter).to(HelloRouter).inSingletonScope();

container.bind<Router>(Router).toSelf().inSingletonScope();

export { container };
