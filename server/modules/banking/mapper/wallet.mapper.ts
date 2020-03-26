import { BaseMapper } from '../../../helpers/base.mapper';
import { WalletDomain } from '../domain/wallet.domain';
import { WalletEntity } from '../entity/wallet.entity';

class WalletMapper extends BaseMapper<WalletEntity, WalletDomain> {
    entityToDomain(walletEntity: WalletEntity): WalletDomain {
        if (!walletEntity) {
            return undefined;
        }
        const walletDomain = new WalletDomain();
        walletDomain.id = walletEntity.id;
        walletDomain.currentBalance = walletEntity.currentBalance;
        walletDomain.currency = walletEntity.currency;
        walletDomain.companyId = walletEntity.companyId;
        walletDomain.isMasterWallet = walletEntity.isMasterWallet;
        return walletDomain;
    }

    domainToEntity(walletEntity: WalletEntity, walletDomain: WalletDomain): WalletEntity {
        if (!walletEntity || !walletDomain) {
            return undefined;
        }

        walletEntity.id = walletDomain.id;
        walletEntity.currentBalance = walletDomain.currentBalance;
        walletEntity.currency = walletDomain.currency;
        walletEntity.companyId = walletDomain.companyId;
        walletEntity.isMasterWallet = walletDomain.isMasterWallet;
        return walletEntity;
    }
}

export const walletMapper = new WalletMapper();
