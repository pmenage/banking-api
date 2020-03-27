import { IWalletService, WalletService } from "../modules/banking/service/wallet.service";
import { IWalletRepository } from "../modules/banking/repository/wallet.repository";
import { WalletDomain } from "../modules/banking/domain/wallet.domain";

describe('WalletService', () => {
    let walletService: IWalletService;
    let walletRepositoryMock: IWalletRepository;

    describe('create', () => {
        beforeEach(() => {
            walletRepositoryMock = {
                findAllByCompanyId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
        });
        test('should create a wallet', async () => {
            // Given
            const walletDomain = new WalletDomain();
            const companyId = 1;
            walletService = new WalletService(walletRepositoryMock);

            // When
            await walletService.create(walletDomain, companyId);

            // Then
            expect(walletRepositoryMock.save).toHaveBeenCalled();
        });
    });

    describe('findAllByCompanyId', () => {
        beforeEach(() => {
            walletRepositoryMock = {
                findAllByCompanyId: jest.fn(),
                findById: jest.fn(),
                save: jest.fn(),
            }
        });
        test('should call walletRepository', async () => {
            // Given
            const companyId = 1;
            walletRepositoryMock.findAllByCompanyId = jest.fn(async () => []);
            walletService = new WalletService(walletRepositoryMock);

            // When
            await walletService.findAllByCompanyId(companyId);

            // Then
            expect(walletRepositoryMock.findAllByCompanyId).toHaveBeenCalledWith(companyId);
        });
    });
});