import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { IWalletService, WalletService } from '../service/wallet.service';

export interface IWalletController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@injectable()
export class WalletController implements IWalletController {
    constructor(@inject(WalletService) private walletService: IWalletService) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const wallet = await this.walletService.create(req.body, +req.get('Company-Id'));
            console.log(wallet);
            res.status(201).json(wallet);
        } catch (error) {
            next(error);
        }
    }
}
