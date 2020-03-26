import { injectable } from 'inversify';
import { NextFunction, Request, Response, Router } from 'express';

@injectable()
export class HelloRouter {
    private router: Router;

    constructor() {
        this.router = Router({ mergeParams: true });
        this.setRoutes();
    }

    setRoutes() {
        this.router
            .get('/', [], (req: Request, res: Response, next: NextFunction) => {
                res.send("Hello world");
            });
    }

    getRouter() {
        return this.router;
    }
}
