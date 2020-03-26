import { Container } from 'inversify';

import DatabaseContext from '../contexts/dbContext';
import DatabaseProvider from './database-provider';
import { Middleware } from '../helpers/middleware';
import Router from '../helpers/router';

import { CardController } from '../modules/banking/controller/card.controller';
import { CardService } from '../modules/banking/service/card.service';
import { CardRepository } from '../modules/banking/repository/card.repository';
import { CardRouter } from '../modules/banking/card.router';

import { WalletController } from '../modules/banking/controller/wallet.controller';
import { WalletService } from '../modules/banking/service/wallet.service';
import { WalletRepository } from '../modules/banking/repository/wallet.repository';
import { WalletRouter } from '../modules/banking/wallet.router';

const container = new Container();

container.bind<DatabaseContext>(DatabaseContext).to(DatabaseContext).inSingletonScope();
container.bind<DatabaseProvider>(DatabaseProvider).to(DatabaseProvider).inSingletonScope();
container.bind<Middleware>(Middleware).toSelf().inSingletonScope();

container.bind<WalletController>(WalletController).to(WalletController).inSingletonScope();
container.bind<WalletService>(WalletService).to(WalletService).inSingletonScope();
container.bind<WalletRepository>(WalletRepository).to(WalletRepository).inSingletonScope();
container.bind<WalletRouter>(WalletRouter).to(WalletRouter).inSingletonScope();

container.bind<CardController>(CardController).to(CardController).inSingletonScope();
container.bind<CardService>(CardService).to(CardService).inSingletonScope();
container.bind<CardRepository>(CardRepository).to(CardRepository).inSingletonScope();
container.bind<CardRouter>(CardRouter).to(CardRouter).inSingletonScope();

container.bind<Router>(Router).toSelf().inSingletonScope();

export { container };
