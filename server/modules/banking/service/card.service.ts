import { injectable, inject } from 'inversify';

import { CardDomain } from '../domain/card.domain';
import { CardEntity } from '../entity/card.entity';
import { cardMapper } from '../mapper/card.mapper';
import { ICardRepository, CardRepository } from '../repository/card.repository';
import { WalletRepository, IWalletRepository } from '../repository/wallet.repository';
import { NotFoundError, BadRequestError } from '../../../helpers/error';

export interface ICardService {
    create(cardDomain: CardDomain, companyId: number): Promise<CardDomain>;
    findAllByUserId(userId: number): Promise<CardDomain[]>
}

@injectable()
export class CardService implements ICardService {
    constructor(
        @inject(CardRepository) private cardRepository: ICardRepository,
        @inject(WalletRepository) private walletRepository: IWalletRepository,
    ) { }

    async create(cardDomain: CardDomain, userId: number): Promise<CardDomain> {
        const walletEntity = await this.walletRepository.findById(cardDomain.walletId);
        if (!walletEntity) {
            throw new BadRequestError(`Wallet with id ${cardDomain.walletId} not found`)
        }
        const cardEntity = cardMapper.domainToEntity(new CardEntity(), cardDomain, walletEntity);
        cardEntity.userId = userId;
        cardEntity.cardNumber = this.generateCardNumber();
        cardEntity.ccv = this.generateCCV();
        const savedCardEntity = await this.cardRepository.save(cardEntity);
        return cardMapper.entityToDomain(savedCardEntity);
    }

    async findAllByUserId(userId: number): Promise<CardDomain[]> {
        const cardEntities = await this.cardRepository.findAllByUserId(userId);
        return cardMapper.entityToDomainArray(cardEntities);
    }

    generateCardNumber(): string {
        return "4242 4242 4242 4242";
    }

    generateCCV(): string {
        return "123";
    }
}
