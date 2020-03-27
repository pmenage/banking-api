import { Currency } from '../entity/wallet.entity';
import { Status } from '../entity/card.entity';
import { IsNumber, IsOptional } from 'class-validator';
import { IsCurrency, IsStatus } from '../../../helpers/decorators';

export class CardDomain {
    id?: number;

    @IsNumber()
    walletId: number;

    @IsCurrency()
    @IsOptional()
    currency?: Currency;

    currentBalance: number;

    expirationDate: string;

    cardNumber: string;

    ccv: string;

    userId: number;

    @IsStatus()
    @IsOptional()
    status?: Status;
}

export class CardLoadDomain {
    @IsNumber()
    amount: number;
}
