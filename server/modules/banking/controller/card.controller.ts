import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { ICardService, CardService } from '../service/card.service';

export interface ICardController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    findAllByUserId(req: Request, res: Response, next: NextFunction): Promise<void>
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
}
