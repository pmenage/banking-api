import { injectable } from 'inversify';

import { IWalletService } from '../../modules/banking/service/wallet.service';
import { WalletDomain } from '../../modules/banking/domain/wallet.domain';

@injectable()
export class WalletServiceStub implements IWalletService {
    private wallets: WalletDomain[] = [];

    async create(walletDomain: WalletDomain): Promise<WalletDomain> {
        this.wallets.push(walletDomain);
        return walletDomain;
    }

    async findAllByCompanyId(companyId: number): Promise<WalletDomain[]> {
        return this.wallets.filter(wallet => wallet.companyId === companyId);
    }
}
