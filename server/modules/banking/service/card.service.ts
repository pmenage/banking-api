import { injectable, inject } from 'inversify';

import { CardDomain, CardLoadDomain } from '../domain/card.domain';
import { CardEntity, Status } from '../entity/card.entity';
import { cardMapper } from '../mapper/card.mapper';
import { ICardRepository, CardRepository } from '../repository/card.repository';
import { WalletRepository, IWalletRepository } from '../repository/wallet.repository';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../../helpers/error';

export interface ICardService {
    create(cardDomain: CardDomain, userId: number): Promise<CardDomain>;
    findAllByUserId(userId: number): Promise<CardDomain[]>
    block(id: number, userId: number): Promise<CardDomain>;
    load(id: number, cardLoadDomain: CardLoadDomain, userId: number): Promise<CardDomain>;
    unblock(id: number, userId: number): Promise<CardDomain>;
    unload(id: number, cardLoadDomain: CardLoadDomain, userId: number): Promise<CardDomain>;
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

    async block(id: number, userId: number): Promise<CardDomain> {
        const cardEntity = await this.cardRepository.findById(id);
        if (!cardEntity) {
            throw new NotFoundError(`Card with id ${id} not found`);
        }
        if (cardEntity.userId !== userId) {
            throw new ForbiddenError(`Forbidden`);
        }
        cardEntity.status = Status.Blocked;
        const walletEntity = await this.walletRepository.findById(cardEntity.wallet.id);
        if (!walletEntity) {
            throw new NotFoundError(`Wallet with id ${id} not found`);
        }
        walletEntity.currentBalance += cardEntity.currentBalance;
        cardEntity.currentBalance = 0;
        await this.walletRepository.save(walletEntity);
        const savedCardEntity = await this.cardRepository.save(cardEntity);
        return cardMapper.entityToDomain(savedCardEntity);
    }

    async load(id: number, cardLoadDomain: CardLoadDomain, userId: number): Promise<CardDomain> {
        const cardEntity = await this.cardRepository.findById(id);
        if (!cardEntity) {
            throw new NotFoundError(`Card with id ${id} not found`);
        }
        if (cardEntity.userId !== userId) {
            throw new ForbiddenError(`Forbidden`);
        }
        if (cardEntity.status === Status.Blocked) {
            throw new BadRequestError(`Card is blocked`);
        }
        const walletEntity = await this.walletRepository.findById(cardEntity.wallet.id);
        if (!walletEntity) {
            throw new NotFoundError(`Wallet with id ${id} not found`);
        }
        walletEntity.currentBalance -= cardLoadDomain.amount;
        cardEntity.currentBalance += cardLoadDomain.amount;
        await this.walletRepository.save(walletEntity);
        const savedCardEntity = await this.cardRepository.save(cardEntity);
        return cardMapper.entityToDomain(savedCardEntity);
    }

    async unblock(id: number, userId: number): Promise<CardDomain> {
        const cardEntity = await this.cardRepository.findById(id);
        if (!cardEntity) {
            throw new NotFoundError(`Card with id ${id} not found`);
        }
        if (cardEntity.userId !== userId) {
            throw new ForbiddenError(`Forbidden`);
        }
        cardEntity.status = Status.Unblocked;
        const savedCardEntity = await this.cardRepository.save(cardEntity);
        return cardMapper.entityToDomain(savedCardEntity);
    }

    async unload(id: number, cardLoadDomain: CardLoadDomain, userId: number): Promise<CardDomain> {
        const cardEntity = await this.cardRepository.findById(id);
        if (!cardEntity) {
            throw new NotFoundError(`Card with id ${id} not found`);
        }
        if (cardEntity.userId !== userId) {
            throw new ForbiddenError(`Forbidden`);
        }
        if (cardEntity.status === Status.Blocked) {
            throw new ForbiddenError(`Card is blocked`);
        }
        const walletEntity = await this.walletRepository.findById(cardEntity.wallet.id);
        if (!walletEntity) {
            throw new NotFoundError(`Wallet with id ${id} not found`);
        }
        walletEntity.currentBalance += cardLoadDomain.amount;
        cardEntity.currentBalance -= cardLoadDomain.amount;
        await this.walletRepository.save(walletEntity);
        const savedCardEntity = await this.cardRepository.save(cardEntity);
        return cardMapper.entityToDomain(savedCardEntity);
    }


    generateCardNumber(): string {
        const cardNumber = [];
        for (let i = 0; i < 4; i++) {
            cardNumber.push(this.generateNumbers(4));
        }
        return cardNumber.join(' ');
    }

    generateCCV(): string {
        return this.generateNumbers(3);
    }

    generateNumbers(length: number): string {
        const result = [];
        const characters = '0123456789';
        for (let i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
        }
        return result.join('');
    }
}
