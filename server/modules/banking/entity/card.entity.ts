import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

import { WalletEntity } from './wallet.entity';

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
    @Column()
    cardNumber: string;
    @Column()
    ccv: string;
    @Column()
    userId: number;
    @Column({ default: false })
    isBlocked: boolean;
}
