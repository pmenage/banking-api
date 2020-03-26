import { Currency } from '../entity/wallet.entity';
import { Status } from '../entity/card.entity';
import { IsNumber } from 'class-validator';

export class CardDomain {
    id?: number;

    @IsNumber()
    walletId: number;

    currency: Currency;

    currentBalance: number;

    expirationDate: string;

    cardNumber: string;

    ccv: string;

    userId: number;

    status: Status;
}
