import * as httpMocks from 'node-mocks-http';
import { Request, Response, NextFunction } from 'express';
import "reflect-metadata";

import { WalletServiceStub } from './stubs/wallet.service.stub';
import { WalletController } from '../modules/banking/controller/wallet.controller';

describe('WalletController', () => {
    let req: httpMocks.MockRequest<Request>;
    let res: httpMocks.MockResponse<Response>;
    let next: NextFunction;
    let walletController: WalletController;
    let walletService: WalletServiceStub;

    describe('create', () => {
        beforeEach(() => {
            req = httpMocks.createRequest({
                headers: {
                    'Company-Id': '1'
                }
            });
            res = httpMocks.createResponse();
            next = jest.fn();
            walletService = new WalletServiceStub();
            walletController = new WalletController(walletService);
        });
        test('should create a new wallet', async () => {
            // Given
            req.body = {
                currency: 1,
                currentBalance: 400,
            }

            // When
            await walletController.create(req, res, next);

            // Then
            expect(req.get('Company-Id')).toBe('1');
            expect(res.statusCode).toBe(201);
            expect(res._getJSONData()).toStrictEqual({ "currency": 1, "currentBalance": 400 });
        });

        test('should find all wallets', async () => {
            // Given
            const walletDomain = {
                currency: 1,
                currentBalance: 400,
                companyId: 5,
            }
            await walletService.create(walletDomain);

            // When
            await walletController.findAllByCompanyId(req, res, next);

            // Then
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toStrictEqual([{ "currency": 1, "currentBalance": 400, "companyId": 5 }]);
        });
    });
})
