import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum Currency {
    EUR = 1,
    GBP,
    USD,
}

@Entity('wallet')
export class WalletEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @Column({ default: 0 })
    currentBalance: number;
    @Column({ default: Currency.EUR })
    currency: Currency;
    @Column()
    companyId: number;
    @Column({ default: false })
    isMasterWallet: boolean;
}
