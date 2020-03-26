import * as express from 'express';
import { Validator } from 'class-validator';
import { injectable } from 'inversify';
import { ErrorHandler, BadRequestError } from './error';

export interface IMiddleware {
    validate<T>(type: Constructor<T>): express.RequestHandler;
    errorHandler(err: Error, req: express.Request, res: express.Response, next: express.NextFunction): void;
}

type Constructor<T> = { new(): T };

@injectable()
export class Middleware implements IMiddleware {
    validate<T>(type: Constructor<T>): express.RequestHandler {
        const validator = new Validator();

        return (req, _res, next) => {
            const input = Object.assign(new type(), req.body);
            const errors = validator.validateSync(input);
            if (errors.length > 0) {
                throw new BadRequestError(errors);
            } else {
                req.body = input;
                next();
            }
        };
    }

    errorHandler(err: ErrorHandler, _req: express.Request, res: express.Response, _next: express.NextFunction): void {
        const { statusCode, message } = err;
        res.status(statusCode || 500).json({ message }).end();
    }
}
