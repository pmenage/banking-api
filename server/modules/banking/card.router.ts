import { injectable, inject } from 'inversify';
import { Router } from 'express';

import { Middleware, IMiddleware } from '../../helpers/middleware';
import { CardController, ICardController } from './controller/card.controller';
import { CardDomain } from './domain/card.domain';

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
            .post('/', [this.mw.validate(CardDomain)], this.cardController.create.bind(this.cardController));
    }

    getRouter() {
        return this.router;
    }
}
