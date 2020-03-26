import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { IWalletService, WalletService } from '../service/wallet.service';

export interface IWalletController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    findAllByCompanyId(req: Request, res: Response, next: NextFunction): Promise<void>
}

@injectable()
export class WalletController implements IWalletController {
    constructor(@inject(WalletService) private walletService: IWalletService) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const walletDomain = await this.walletService.create(req.body, +req.get('Company-Id'));
            console.log(walletDomain);
            res.status(201).json(walletDomain);
        } catch (error) {
            next(error);
        }
    }

    async findAllByCompanyId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const walletDomains = await this.walletService.findAllByCompanyId(+req.get('Company-Id'));
            res.json(walletDomains);
        } catch (error) {
            next(error);
        }
    }
}
