import * as httpMocks from 'node-mocks-http';
import { Request, Response, NextFunction } from 'express';
import "reflect-metadata";

import { WalletController } from '../modules/banking/controller/wallet.controller';
import { Currency, WalletEntity } from '../modules/banking/entity/wallet.entity';
import { IWalletService } from '../modules/banking/service/wallet.service';
import { WalletDomain } from '../modules/banking/domain/wallet.domain';

describe('WalletService', () => {
    let req: httpMocks.MockRequest<Request>;
    let res: httpMocks.MockResponse<Response>;
    let next: NextFunction;
    let walletServiceMock: IWalletService;

    describe('create', () => {
        beforeEach(() => {
            req = httpMocks.createRequest({
                headers: {
                    'Company-Id': '1'
                }
            });
            res = httpMocks.createResponse();
            next = jest.fn();
            walletServiceMock = {
                create: jest.fn(),
                findAllByCompanyId: jest.fn(),
            }
        });
        test('should create a new wallet', async () => {
            // Given
            req.body = {
                currency: Currency.USD,
                currentBalance: 400,
            }
            walletServiceMock.create = jest.fn(async () => {
                const walletEntity = new WalletDomain();
                walletEntity.currency = Currency.USD;
                walletEntity.currentBalance = 400;
                return walletEntity;
            });
            const walletController = new WalletController(walletServiceMock);

            // When
            await walletController.create(req, res, next);

            // Then
            expect(req.get('Company-Id')).toBe('1');
            expect(walletServiceMock.create).toHaveBeenCalledWith(req.body, +req.get('Company-Id'));
            expect(res.statusCode).toBe(201);
            expect(res._getJSONData()).toStrictEqual({ "currency": Currency.USD, "currentBalance": 400 });
        });
    });

    describe('find wallets by company id', () => {
        beforeEach(() => {
            req = httpMocks.createRequest({
                headers: {
                    'Company-Id': '1'
                }
            });
            res = httpMocks.createResponse();
            next = jest.fn();
            walletServiceMock = {
                create: jest.fn(),
                findAllByCompanyId: jest.fn(),
            }
        });
        test('should find all wallets', async () => {
            // Given
            const walletDomain = new WalletDomain();
            walletDomain.currency = Currency.USD;
            walletDomain.currentBalance = 400;
            walletDomain.companyId = 1;
            walletServiceMock.findAllByCompanyId = jest.fn(async () => [walletDomain]);
            const walletController = new WalletController(walletServiceMock);

            // When
            await walletController.findAllByCompanyId(req, res, next);

            // Then
            expect(walletServiceMock.findAllByCompanyId).toHaveBeenCalledWith(+req.get('Company-Id'));
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toStrictEqual([{ "currency": Currency.USD, "currentBalance": 400, "companyId": 1 }]);
        });
    });
})
