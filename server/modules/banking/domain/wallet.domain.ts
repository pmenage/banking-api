import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

import { Currency } from '../entity/wallet.entity';
import { IsCurrency } from '../../../helpers/decorators';

export class WalletDomain {
    id: number;

    @IsNumber()
    @IsOptional()
    currentBalance?: number;

    @IsCurrency()
    @IsOptional()
    currency?: Currency;

    companyId: number;

    @IsBoolean()
    @IsOptional()
    isMasterWallet?: boolean;
}
