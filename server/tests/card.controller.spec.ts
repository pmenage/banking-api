import * as httpMocks from 'node-mocks-http';
import { Request, Response, NextFunction } from 'express';
import "reflect-metadata";

import { CardController } from '../modules/banking/controller/card.controller';
import { ICardService } from '../modules/banking/service/card.service';
import { CardDomain } from '../modules/banking/domain/card.domain';
import { Currency } from '../modules/banking/entity/wallet.entity';

describe('CardService', () => {
    let req: httpMocks.MockRequest<Request>;
    let res: httpMocks.MockResponse<Response>;
    let next: NextFunction;
    let cardServiceMock: ICardService;

    describe('create', () => {
        beforeEach(() => {
            req = httpMocks.createRequest({
                headers: {
                    'User-Id': '1'
                }
            });
            res = httpMocks.createResponse();
            next = jest.fn();
            cardServiceMock = {
                create: jest.fn(),
                findAllByUserId: jest.fn(),
                block: jest.fn(),
                load: jest.fn(),
                unblock: jest.fn(),
                unload: jest.fn(),
            }
        });
        test('should create a new card', async () => {
            // Given
            req.body = {
                walletId: 1,
            }
            cardServiceMock.create = jest.fn(async () => {
                return new CardDomain();
            });
            const cardController = new CardController(cardServiceMock);

            // When
            await cardController.create(req, res, next);

            // Then
            expect(req.get('User-Id')).toBe('1');
            expect(cardServiceMock.create).toHaveBeenCalledWith(req.body, +req.get('User-Id'));
            expect(res.statusCode).toBe(201);
        });
    });

    describe('find cards by user id', () => {
        beforeEach(() => {
            req = httpMocks.createRequest({
                headers: {
                    'User-Id': '1'
                }
            });
            res = httpMocks.createResponse();
            next = jest.fn();
            cardServiceMock = {
                create: jest.fn(),
                findAllByUserId: jest.fn(),
                block: jest.fn(),
                load: jest.fn(),
                unblock: jest.fn(),
                unload: jest.fn(),
            }
        });
        test('should find all cards', async () => {
            // Given
            const cardDomain = new CardDomain();
            cardDomain.currency = Currency.USD;
            cardDomain.currentBalance = 400;
            cardDomain.userId = 1;
            cardDomain.walletId = 1;
            cardServiceMock.findAllByUserId = jest.fn(async () => [cardDomain]);
            const cardController = new CardController(cardServiceMock);

            // When
            await cardController.findAllByUserId(req, res, next);

            // Then
            expect(cardServiceMock.findAllByUserId).toHaveBeenCalledWith(+req.get('User-Id'));
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toStrictEqual([{ "currency": Currency.USD, "currentBalance": 400, "userId": 1, "walletId": 1 }]);
        });
    });

    describe('block', () => {
        beforeEach(() => {
            req = httpMocks.createRequest({
                headers: {
                    'User-Id': '1'
                }
            });
            res = httpMocks.createResponse();
            next = jest.fn();
            cardServiceMock = {
                create: jest.fn(),
                findAllByUserId: jest.fn(),
                block: jest.fn(),
                load: jest.fn(),
                unblock: jest.fn(),
                unload: jest.fn(),
            }
        });
        test('should block a card', async () => {
            // Given
            req.params.id = '1';
            const cardController = new CardController(cardServiceMock);

            // When
            await cardController.block(req, res, next);

            // Then
            expect(req.get('User-Id')).toBe('1');
            expect(cardServiceMock.block).toHaveBeenCalledWith(+req.params.id, +req.get('User-Id'));
            expect(res.statusCode).toBe(200);
        });
    });

    describe('load', () => {
        beforeEach(() => {
            req = httpMocks.createRequest({
                headers: {
                    'User-Id': '1'
                }
            });
            res = httpMocks.createResponse();
            next = jest.fn();
            cardServiceMock = {
                create: jest.fn(),
                findAllByUserId: jest.fn(),
                block: jest.fn(),
                load: jest.fn(),
                unblock: jest.fn(),
                unload: jest.fn(),
            }
        });
        test('should load money on a card', async () => {
            // Given
            req.body = {
                amount: 10,
            }
            req.params.id = '1';
            const cardController = new CardController(cardServiceMock);

            // When
            await cardController.load(req, res, next);

            // Then
            expect(req.get('User-Id')).toBe('1');
            expect(cardServiceMock.load).toHaveBeenCalledWith(+req.params.id, req.body, +req.get('User-Id'));
            expect(res.statusCode).toBe(200);
        });
    });

    describe('unblock', () => {
        beforeEach(() => {
            req = httpMocks.createRequest({
                headers: {
                    'User-Id': '1'
                }
            });
            res = httpMocks.createResponse();
            next = jest.fn();
            cardServiceMock = {
                create: jest.fn(),
                findAllByUserId: jest.fn(),
                block: jest.fn(),
                load: jest.fn(),
                unblock: jest.fn(),
                unload: jest.fn(),
            }
        });
        test('should unblock a card', async () => {
            // Given
            req.params.id = '1';
            const cardController = new CardController(cardServiceMock);

            // When
            await cardController.unblock(req, res, next);

            // Then
            expect(req.get('User-Id')).toBe('1');
            expect(cardServiceMock.unblock).toHaveBeenCalledWith(+req.params.id, +req.get('User-Id'));
            expect(res.statusCode).toBe(200);
        });
    });

    describe('unload', () => {
        beforeEach(() => {
            req = httpMocks.createRequest({
                headers: {
                    'User-Id': '1'
                }
            });
            res = httpMocks.createResponse();
            next = jest.fn();
            cardServiceMock = {
                create: jest.fn(),
                findAllByUserId: jest.fn(),
                block: jest.fn(),
                load: jest.fn(),
                unblock: jest.fn(),
                unload: jest.fn(),
            }
        });
        test('should unload money from a card', async () => {
            // Given
            req.body = {
                amount: 10,
            }
            req.params.id = '1';
            const cardController = new CardController(cardServiceMock);

            // When
            await cardController.unload(req, res, next);

            // Then
            expect(req.get('User-Id')).toBe('1');
            expect(cardServiceMock.unload).toHaveBeenCalledWith(+req.params.id, req.body, +req.get('User-Id'));
            expect(res.statusCode).toBe(200);
        });
    });
})
