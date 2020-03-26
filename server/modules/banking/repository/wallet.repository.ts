import { injectable, inject } from "inversify";
import DatabaseContext from "../../../contexts/dbContext";
import { WalletEntity } from "../entity/wallet.entity";
import { SelectQueryBuilder } from "typeorm";

export interface IWalletRepository {
    findAllByCompanyId(companyId: number): Promise<WalletEntity[]>;
    findById(id: number): Promise<WalletEntity>;
    save(walletEntity: WalletEntity): Promise<WalletEntity>;
}

@injectable()
export class WalletRepository implements IWalletRepository {
    constructor(@inject(DatabaseContext) private db: DatabaseContext) {
    }

    findAllByCompanyId(companyId: number): Promise<WalletEntity[]> {
        return this._defaultSelectQueryBuilder()
            .where('wallet.companyId = :companyId', { companyId })
            .getMany();
    }

    findById(id: number): Promise<WalletEntity> {
        return this._defaultSelectQueryBuilder()
            .where('wallet.id = :id', { id })
            .getOne();
    }

    save(walletEntity: WalletEntity): Promise<WalletEntity> {
        return this.db.WalletRepository
            .save(walletEntity);
    }

    private _defaultSelectQueryBuilder(): SelectQueryBuilder<WalletEntity> {
        return this.db.WalletRepository
            .createQueryBuilder('wallet')
            .select('wallet');
    }
}