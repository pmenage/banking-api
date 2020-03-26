import * as express from 'express';
import { inject, injectable } from 'inversify';

import { IMiddleware, Middleware } from './middleware';
import { CardRouter } from '../modules/banking/card.router';
import { WalletRouter } from '../modules/banking/wallet.router';

@injectable()
export default class Router {
    public router: express.Router;

    constructor(
        @inject(Middleware) private mw: IMiddleware,
        @inject(CardRouter) private cardRouter: CardRouter,
        @inject(WalletRouter) private walletRouter: WalletRouter,
    ) {
        this.buildRouter();
    }

    buildRouter() {
        this.router = express.Router({ mergeParams: true });

        this.router.use('/api/cards', this.cardRouter.getRouter());
        this.router.use('/api/wallets', this.walletRouter.getRouter());

        this.router.use('/api/*', [this.mw.errorHandler]);
    }
}
