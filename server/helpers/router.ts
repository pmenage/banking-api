import * as express from 'express';
import { inject, injectable } from 'inversify';

import { HelloRouter } from '../modules/banking/hello.router';

@injectable()
export default class Router {
    public router: express.Router;

    constructor(
        @inject(HelloRouter) private helloRouter: HelloRouter,
    ) {
        this.buildRouter();
    }

    buildRouter() {
        this.router = express.Router({ mergeParams: true });

        this.router.use('/api/hello', this.helloRouter.getRouter());
    }
}
