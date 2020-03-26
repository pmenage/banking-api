import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

import { Currency } from './wallet.entity';

export enum TransferType {
    Card = 1,
    Wallet,
}

@Entity('transfer')
export class TransferEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @Column()
    amount: number;
    @Column({ default: Currency.EUR })
    originCurrency: Currency;
    @Column({ default: Currency.EUR })
    targetCurrency: Currency;
    @Column({ nullable: true })
    conversionFee?: number;
    @Column()
    originEntityId: number;
    @Column({ default: TransferType.Card })
    originEntityType: TransferType;
    @Column()
    targetEntityId: number;
    @Column({ default: TransferType.Card })
    targetEntityType: TransferType;
}
