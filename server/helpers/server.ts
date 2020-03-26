import * as bodyParser from 'body-parser';
import { injectable } from 'inversify';

import { container } from '../config/ioc.config';
import Router from './router';
import { Express, Request, Response, NextFunction } from 'express';
import * as express from 'express';

@injectable()
export class Server {
  app: Express;
  router: Router;

  static bootstrap() {
    return new Server();
  }

  constructor() {
    this.app = express();
    this.config();
  }

  config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.set('port', 8888);
    this.app.set('host', '127.0.0.1');
  }

  buildRoutes(): void {
    this.router = container.get<Router>(Router);
    this.routes(this.router.router);
  }

  routes(router: express.Router): void {
    this.app.use(router);

    this.app.use((_req: Request, res: Response, _next: NextFunction) => {
      const err: any = new Error('Route not found');
      err.status = 404;
      res.status(404).json(err);
    });
  }

  async listen() {
    try {
      await this.buildRoutes();
      this.app.listen(this.app.get('port'), this.app.get('host'), () => {
        console.log('Server listening on: ' + this.app.get('host') + ':' + this.app.get('port'));
      });
    }
    catch (e) {
      console.log(e);
    }
  }
}

const server = Server.bootstrap();

export default server;

