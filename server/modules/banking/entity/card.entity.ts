import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

import { WalletEntity, Currency } from './wallet.entity';

export enum Status {
    Blocked = "Blocked",
    Unblocked = "Unblocked",
}

@Entity('card')
export class CardEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @ManyToOne(type => WalletEntity)
    @JoinColumn({ name: 'walletId' })
    wallet: WalletEntity;
    @Column({ default: 0 })
    currentBalance: number;
    @Column({ default: Currency.EUR })
    currency: Currency;
    @Column()
    cardNumber: string;
    @Column()
    ccv: string;
    @Column()
    userId: number;
    @Column({ default: Status.Unblocked })
    status: Status;
}
