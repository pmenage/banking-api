import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

import { Currency } from '../entity/wallet.entity';

export class WalletDomain {
    id?: number;

    @IsNumber()
    @IsOptional()
    currentBalance?: number;

    currency: Currency;

    companyId: number;

    @IsBoolean()
    @IsOptional()
    isMasterWallet?: boolean;
}
