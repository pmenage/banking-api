import { injectable, inject } from 'inversify';

import { WalletDomain } from '../domain/wallet.domain';
import { WalletEntity } from '../entity/wallet.entity';
import { walletMapper } from '../mapper/wallet.mapper';
import { IWalletRepository, WalletRepository } from '../repository/wallet.repository';

export interface IWalletService {
    create(walletDomain: WalletDomain, companyId: number): Promise<WalletDomain>;
    findAllByCompanyId(companyId: number): Promise<WalletDomain[]>
}

@injectable()
export class WalletService implements IWalletService {
    constructor(@inject(WalletRepository) private walletRepository: IWalletRepository) { }

    async create(walletDomain: WalletDomain, companyId: number): Promise<WalletDomain> {
        const walletEntity = walletMapper.domainToEntity(new WalletEntity(), walletDomain);
        walletEntity.companyId = companyId;
        const savedWalletEntity = await this.walletRepository.save(walletEntity);
        return walletMapper.entityToDomain(savedWalletEntity);
    }

    async findAllByCompanyId(companyId: number): Promise<WalletDomain[]> {
        const walletEntities = await this.walletRepository.findAllByCompanyId(companyId);
        return walletMapper.entityToDomainArray(walletEntities);
    }
}
