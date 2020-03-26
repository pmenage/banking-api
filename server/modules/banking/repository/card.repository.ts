import { injectable, inject } from "inversify";
import DatabaseContext from "../../../contexts/dbContext";
import { CardEntity } from "../entity/card.entity";
import { SelectQueryBuilder } from "typeorm";

export interface ICardRepository {
    findAllByUserId(userId: number): Promise<CardEntity[]>
    save(cardEntity: CardEntity): Promise<CardEntity>;
}

@injectable()
export class CardRepository implements ICardRepository {
    constructor(@inject(DatabaseContext) private db: DatabaseContext) {
    }

    findAllByUserId(userId: number): Promise<CardEntity[]> {
        return this._defaultSelectQueryBuilder()
            .where('card.userId = :userId', { userId })
            .getMany();
    }

    save(cardEntity: CardEntity): Promise<CardEntity> {
        return this.db.CardRepository
            .save(cardEntity);
    }

    private _defaultSelectQueryBuilder(): SelectQueryBuilder<CardEntity> {
        return this.db.CardRepository
            .createQueryBuilder('card')
            .select('card')
            .leftJoinAndSelect('card.wallet', 'wallet');
    }
}