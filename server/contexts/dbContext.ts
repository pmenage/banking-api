import { inject, injectable } from 'inversify';
import { Connection, Repository } from 'typeorm';

import DatabaseProvider from '../config/database-provider';

import { CardEntity } from '../modules/banking/entity/card.entity';
import { TransferEntity } from '../modules/banking/entity/transfer.entity';
import { WalletEntity } from '../modules/banking/entity/wallet.entity';

@injectable()
export default class DatabaseContext {
  CardRepository: Repository<CardEntity>;
  TransferRepository: Repository<TransferEntity>;
  WalletRepository: Repository<WalletEntity>;

  private db: Connection;

  constructor(@inject(DatabaseProvider) databaseProvider: DatabaseProvider) {
    try {
      this.db = databaseProvider.db;
      this.initRepositories();
    }
    catch (e) {
      console.log(e);
    }
  }

  initRepositories() {
    this.CardRepository = this.db.getRepository(CardEntity);
    this.TransferRepository = this.db.getRepository(TransferEntity);
    this.WalletRepository = this.db.getRepository(WalletEntity);
  }
}
