import { CardService, ICardService } from '../modules/banking/service/card.service';
import { ICardRepository } from '../modules/banking/repository/card.repository';
import { IWalletRepository } from '../modules/banking/repository/wallet.repository';
import { ForbiddenError, NotFoundError, BadRequestError } from '../helpers/error';
import { CardEntity, Status } from '../modules/banking/entity/card.entity';
import { WalletEntity } from '../modules/banking/entity/wallet.entity';
import { CardLoadDomain, CardDomain } from '../modules/banking/domain/card.domain';

describe('CardService', () => {
    let cardService: ICardService;
    let cardRepositoryMock: ICardRepository;
    let walletRepositoryMock: IWalletRepository;

    describe('create', () => {
        beforeEach(() => {
            cardRepositoryMock = {
                findAllByUserId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
            walletRepositoryMock = {
                findAllByCompanyId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
        });
        test('should throw a BadRequestError if walletEntity is not found', async () => {
            // Given
            const cardDomain = new CardDomain();
            cardDomain.walletId = 1;
            const userId = 1;
            walletRepositoryMock.findById = jest.fn(() => undefined);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.create(cardDomain, userId)).rejects.toThrow(BadRequestError);
        });

        test('should create a card', async () => {
            // Given
            const cardDomain = new CardDomain();
            cardDomain.walletId = 1;
            const userId = 1;
            const walletEntity = new WalletEntity();
            walletEntity.id = 1;
            walletRepositoryMock.findById = jest.fn(async () => walletEntity);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // When
            await cardService.create(cardDomain, userId);

            // Then
            expect(walletRepositoryMock.findById).toHaveBeenCalledWith(cardDomain.walletId);
            expect(cardRepositoryMock.save).toHaveBeenCalled();
        });
    });

    describe('findAllByUserId', () => {
        beforeEach(() => {
            cardRepositoryMock = {
                findAllByUserId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
            walletRepositoryMock = {
                findAllByCompanyId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
        });
        test('should call cardRepository', async () => {
            // Given
            const userId = 1;
            cardRepositoryMock.findAllByUserId = jest.fn(async () => []);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // When
            await cardService.findAllByUserId(userId);

            // Then
            expect(cardRepositoryMock.findAllByUserId).toHaveBeenCalledWith(userId);
        });
    });

    describe('block', () => {
        beforeEach(() => {
            cardRepositoryMock = {
                findAllByUserId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
            walletRepositoryMock = {
                findAllByCompanyId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
        });
        test('should throw a NotFoundError if cardEntity is not found', async () => {
            // Given
            const id = 1;
            const userId = 1;
            cardRepositoryMock.findById = jest.fn(() => undefined);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.block(id, userId)).rejects.toThrow(NotFoundError);
        });

        test('should throw a ForbiddenError if user id is different from card user id', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.userId = 2;
            const id = 1;
            const userId = 1;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.block(id, userId)).rejects.toThrow(ForbiddenError);
        });

        test('should throw a NotFoundError if walletEntity is not found', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.userId = 1;
            const walletEntity = new WalletEntity();
            walletEntity.id = 1;
            cardEntity.wallet = walletEntity;
            const id = 1;
            const userId = 1;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            walletRepositoryMock.findById = jest.fn(async () => undefined);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.block(id, userId)).rejects.toThrow(new NotFoundError('Wallet with id 1 not found'));
        });

        test('card should be blocked', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.status = Status.Blocked;
            cardEntity.userId = 1;
            cardEntity.currentBalance = 20;
            const walletEntity = new WalletEntity();
            walletEntity.id = 1;
            walletEntity.currentBalance = 10;
            cardEntity.wallet = walletEntity;
            const id = 1;
            const userId = 1;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            cardRepositoryMock.save = jest.fn(async () => cardEntity);
            walletRepositoryMock.findById = jest.fn(async () => walletEntity);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // When
            const cardDomain = await cardService.block(id, userId);

            // Then
            expect(cardRepositoryMock.findById).toHaveBeenCalledWith(id);
            expect(walletRepositoryMock.findById).toHaveBeenCalledWith(cardEntity.wallet.id);
            expect(cardRepositoryMock.save).toHaveBeenCalled();
            expect(cardDomain.status).toBe(Status.Blocked);
            expect(cardDomain.currentBalance).toBe(0);
            expect(walletEntity.currentBalance).toBe(30);
        });
    });

    describe('load', () => {
        beforeEach(() => {
            cardRepositoryMock = {
                findAllByUserId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
            walletRepositoryMock = {
                findAllByCompanyId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
        });
        test('should throw a NotFoundError if cardEntity is not found', async () => {
            // Given
            const id = 1;
            const userId = 1;
            const cardLoadDomain = new CardLoadDomain();
            cardLoadDomain.amount = 10;
            cardRepositoryMock.findById = jest.fn(() => undefined);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.load(id, cardLoadDomain, userId)).rejects.toThrow(new NotFoundError('Card with id 1 not found'));
        });

        test('should throw a ForbiddenError if user id is different from card user id', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.userId = 2;
            const id = 1;
            const userId = 1;
            const cardLoadDomain = new CardLoadDomain();
            cardLoadDomain.amount = 10;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.load(id, cardLoadDomain, userId)).rejects.toThrow(ForbiddenError);
        });

        test('should throw a BadRequestError if card is blocked', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.userId = 1;
            cardEntity.status = Status.Blocked
            const id = 1;
            const userId = 1;
            const cardLoadDomain = new CardLoadDomain();
            cardLoadDomain.amount = 10;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.load(id, cardLoadDomain, userId)).rejects.toThrow(new BadRequestError('Card is blocked'));
        });

        test('should throw a NotFoundError if walletEntity is not found', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.status = Status.Unblocked;
            cardEntity.userId = 1;
            const walletEntity = new WalletEntity();
            walletEntity.id = 1;
            cardEntity.wallet = walletEntity;
            const id = 1;
            const userId = 1;
            const cardLoadDomain = new CardLoadDomain();
            cardLoadDomain.amount = 10;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            walletRepositoryMock.findById = jest.fn(async () => undefined);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.load(id, cardLoadDomain, userId)).rejects.toThrow(new NotFoundError('Wallet with id 1 not found'));
        });

        test('card should be loaded', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.status = Status.Unblocked;
            cardEntity.userId = 1;
            cardEntity.currentBalance = 0;
            const walletEntity = new WalletEntity();
            walletEntity.id = 1;
            walletEntity.currentBalance = 20;
            cardEntity.wallet = walletEntity;
            const id = 1;
            const userId = 1;
            const cardLoadDomain = new CardLoadDomain();
            cardLoadDomain.amount = 10;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            cardRepositoryMock.save = jest.fn(async () => cardEntity);
            walletRepositoryMock.findById = jest.fn(async () => walletEntity);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // When
            const cardDomain = await cardService.load(id, cardLoadDomain, userId);

            // Then
            expect(cardRepositoryMock.findById).toHaveBeenCalledWith(id);
            expect(walletRepositoryMock.findById).toHaveBeenCalledWith(cardEntity.wallet.id);
            expect(cardRepositoryMock.save).toHaveBeenCalled();
            expect(cardDomain.status).toBe(Status.Unblocked);
            expect(cardDomain.currentBalance).toBe(10);
            expect(walletEntity.currentBalance).toBe(10);
        });
    });

    describe('unblock', () => {
        beforeEach(() => {
            cardRepositoryMock = {
                findAllByUserId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
            walletRepositoryMock = {
                findAllByCompanyId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
        });
        test('should throw a NotFoundError if cardEntity is not found', async () => {
            // Given
            const id = 1;
            const userId = 1;
            cardRepositoryMock.findById = jest.fn(() => undefined);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.unblock(id, userId)).rejects.toThrow(NotFoundError);
        });

        test('should throw a Forbidden error if user id is different from card user id', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.userId = 2;
            const id = 1;
            const userId = 1;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.unblock(id, userId)).rejects.toThrow(ForbiddenError);
        });

        test('card should be unblocked', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.status = Status.Blocked;
            cardEntity.userId = 1;
            const id = 1;
            const userId = 1;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            cardRepositoryMock.save = jest.fn(async () => cardEntity);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // When
            const cardDomain = await cardService.unblock(id, userId);

            // Then
            expect(cardRepositoryMock.findById).toHaveBeenCalledWith(id);
            expect(cardRepositoryMock.save).toHaveBeenCalled();
            expect(cardDomain.status).toBe(Status.Unblocked);
        });
    });

    describe('unload', () => {
        beforeEach(() => {
            cardRepositoryMock = {
                findAllByUserId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
            walletRepositoryMock = {
                findAllByCompanyId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
        });
        test('should throw a NotFoundError if cardEntity is not found', async () => {
            // Given
            const id = 1;
            const userId = 1;
            const cardLoadDomain = new CardLoadDomain();
            cardLoadDomain.amount = 10;
            cardRepositoryMock.findById = jest.fn(() => undefined);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.unload(id, cardLoadDomain, userId)).rejects.toThrow(new NotFoundError('Card with id 1 not found'));
        });

        test('should throw a ForbiddenError if user id is different from card user id', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.userId = 2;
            const id = 1;
            const userId = 1;
            const cardLoadDomain = new CardLoadDomain();
            cardLoadDomain.amount = 10;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.unload(id, cardLoadDomain, userId)).rejects.toThrow(ForbiddenError);
        });

        test('should throw a BadRequestError if card is blocked', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.userId = 1;
            cardEntity.status = Status.Blocked
            const id = 1;
            const userId = 1;
            const cardLoadDomain = new CardLoadDomain();
            cardLoadDomain.amount = 10;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.unload(id, cardLoadDomain, userId)).rejects.toThrow(new BadRequestError('Card is blocked'));
        });

        test('should throw a NotFoundError if walletEntity is not found', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.status = Status.Unblocked;
            cardEntity.userId = 1;
            const walletEntity = new WalletEntity();
            walletEntity.id = 1;
            cardEntity.wallet = walletEntity;
            const id = 1;
            const userId = 1;
            const cardLoadDomain = new CardLoadDomain();
            cardLoadDomain.amount = 10;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            walletRepositoryMock.findById = jest.fn(async () => undefined);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // Then
            await expect(cardService.unload(id, cardLoadDomain, userId)).rejects.toThrow(new NotFoundError('Wallet with id 1 not found'));
        });

        test('card should be unloaded', async () => {
            // Given
            const cardEntity = new CardEntity();
            cardEntity.status = Status.Unblocked;
            cardEntity.userId = 1;
            cardEntity.currentBalance = 10;
            const walletEntity = new WalletEntity();
            walletEntity.id = 1;
            walletEntity.currentBalance = 20;
            cardEntity.wallet = walletEntity;
            const id = 1;
            const userId = 1;
            const cardLoadDomain = new CardLoadDomain();
            cardLoadDomain.amount = 10;
            cardRepositoryMock.findById = jest.fn(async () => cardEntity);
            cardRepositoryMock.save = jest.fn(async () => cardEntity);
            walletRepositoryMock.findById = jest.fn(async () => walletEntity);
            cardService = new CardService(cardRepositoryMock, walletRepositoryMock);

            // When
            const cardDomain = await cardService.unload(id, cardLoadDomain, userId);

            // Then
            expect(cardRepositoryMock.findById).toHaveBeenCalledWith(id);
            expect(walletRepositoryMock.findById).toHaveBeenCalledWith(cardEntity.wallet.id);
            expect(cardRepositoryMock.save).toHaveBeenCalled();
            expect(cardDomain.status).toBe(Status.Unblocked);
            expect(cardDomain.currentBalance).toBe(0);
            expect(walletEntity.currentBalance).toBe(30);
        });
    });
});
