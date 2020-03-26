import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { ICardService, CardService } from '../service/card.service';

export interface ICardController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    findAllByUserId(req: Request, res: Response, next: NextFunction): Promise<void>
    block(req: Request, res: Response, next: NextFunction): Promise<void>;
    load(req: Request, res: Response, next: NextFunction): Promise<void>;
    unblock(req: Request, res: Response, next: NextFunction): Promise<void>;
    unload(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@injectable()
export class CardController implements ICardController {
    constructor(@inject(CardService) private cardService: ICardService) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cardDomain = await this.cardService.create(req.body, +req.get('User-Id'));
            res.status(201).json(cardDomain);
        } catch (error) {
            next(error);
        }
    }

    async findAllByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cardDomains = await this.cardService.findAllByUserId(+req.get('User-Id'));
            res.json(cardDomains);
        } catch (error) {
            next(error);
        }
    }

    async block(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cardDomain = await this.cardService.block(+req.params.id);
            res.json(cardDomain);
        } catch (error) {
            next(error);
        }
    }

    async load(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cardDomain = await this.cardService.load(+req.params.id, req.body);
            res.json(cardDomain);
        } catch (error) {
            next(error);
        }
    }

    async unblock(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cardDomain = await this.cardService.unblock(+req.params.id);
            res.json(cardDomain);
        } catch (error) {
            next(error);
        }
    }

    async unload(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cardDomain = await this.cardService.unload(+req.params.id, req.body);
            res.json(cardDomain);
        } catch (error) {
            next(error);
        }
    }

}
