import { injectable, inject } from 'inversify';
import { Router } from 'express';

import { Middleware, IMiddleware } from '../../helpers/middleware';
import { WalletController, IWalletController } from './controller/wallet.controller';
import { WalletDomain } from './domain/wallet.domain';

@injectable()
export class WalletRouter {
    private router: Router;

    constructor(
        @inject(WalletController) private walletController: IWalletController,
        @inject(Middleware) private mw: IMiddleware,
    ) {
        this.router = Router({ mergeParams: true });
        this.setRoutes();
    }

    setRoutes() {
        this.router
            .get('/', [], this.walletController.findAllByCompanyId.bind(this.walletController))
            .post('/', [this.mw.validate(WalletDomain)], this.walletController.create.bind(this.walletController));
    }

    getRouter() {
        return this.router;
    }
}
