import * as express from 'express';
import { inject, injectable } from 'inversify';

import { IMiddleware, Middleware } from './middleware';
import { WalletRouter } from '../modules/banking/wallet.router';

@injectable()
export default class Router {
    public router: express.Router;

    constructor(
        @inject(Middleware) private mw: IMiddleware,
        @inject(WalletRouter) private walletRouter: WalletRouter,
    ) {
        this.buildRouter();
    }

    buildRouter() {
        this.router = express.Router({ mergeParams: true });

        this.router.use('/api/wallets', this.walletRouter.getRouter());

        this.router.use('/api/*', [this.mw.errorHandler]);
    }
}
