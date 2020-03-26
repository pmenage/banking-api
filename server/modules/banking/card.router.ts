import { injectable, inject } from 'inversify';
import { Router } from 'express';

import { Middleware, IMiddleware } from '../../helpers/middleware';
import { CardController, ICardController } from './controller/card.controller';
import { CardDomain, CardLoadDomain } from './domain/card.domain';

@injectable()
export class CardRouter {
    private router: Router;

    constructor(
        @inject(CardController) private cardController: ICardController,
        @inject(Middleware) private mw: IMiddleware,
    ) {
        this.router = Router({ mergeParams: true });
        this.setRoutes();
    }

    setRoutes() {
        this.router
            .get('/', [], this.cardController.findAllByUserId.bind(this.cardController))
            .post('/', [this.mw.validate(CardDomain)], this.cardController.create.bind(this.cardController))
            .post('/load/:id', [this.mw.validate(CardLoadDomain)], this.cardController.load.bind(this.cardController))
            .post('/unload/:id', [this.mw.validate(CardLoadDomain)], this.cardController.unload.bind(this.cardController))
            .post('/block/:id', [], this.cardController.block.bind(this.cardController))
            .post('/unblock/:id', [], this.cardController.unblock.bind(this.cardController));
    }

    getRouter() {
        return this.router;
    }
}
