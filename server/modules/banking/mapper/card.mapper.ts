import { BaseMapper } from '../../../helpers/base.mapper';
import { CardDomain } from '../domain/card.domain';
import { CardEntity } from '../entity/card.entity';
import { WalletEntity } from '../entity/wallet.entity';
import * as moment from 'moment';

class CardMapper extends BaseMapper<CardEntity, CardDomain> {
    entityToDomain(cardEntity: CardEntity): CardDomain {
        if (!cardEntity) {
            return undefined;
        }
        const cardDomain = new CardDomain();
        cardDomain.id = cardEntity.id;
        if (cardEntity.wallet) {
            cardDomain.walletId = cardEntity.wallet.id;
        }
        cardDomain.currentBalance = cardEntity.currentBalance;
        cardDomain.currency = cardEntity.currency;
        cardDomain.expirationDate = moment(cardEntity.createdAt).add(1, 'M').format("YYYY-MM-DD HH:mm:ss");
        cardDomain.cardNumber = cardEntity.cardNumber;
        cardDomain.ccv = cardEntity.ccv;
        cardDomain.userId = cardEntity.userId;
        cardDomain.status = cardEntity.status;
        return cardDomain;
    }

    domainToEntity(cardEntity: CardEntity, cardDomain: CardDomain, walletEntity: WalletEntity): CardEntity {
        if (!cardEntity || !cardDomain) {
            return undefined;
        }

        cardEntity.id = cardDomain.id;
        cardEntity.wallet = walletEntity;
        cardEntity.currentBalance = cardDomain.currentBalance;
        cardEntity.currency = cardDomain.currency;
        cardEntity.cardNumber = cardDomain.cardNumber;
        cardEntity.ccv = cardDomain.ccv;
        cardEntity.userId = cardDomain.userId;
        cardEntity.status = cardDomain.status;
        return cardEntity;
    }
}

export const cardMapper = new CardMapper();
