import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Init1585214330904 implements MigrationInterface {
    name = 'Init1585214330904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'wallet',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'currentBalance',
                    type: 'double',
                    default: 0
                },
                {
                    name: 'currency',
                    type: 'int',
                    default: 1,
                },
                {
                    name: 'companyId',
                    type: 'int',
                },
                {
                    name: 'isMasterWallet',
                    type: 'boolean',
                    default: false,
                },
            ]
        }));

        await queryRunner.createTable(new Table({
            name: 'card',
            foreignKeys: [
                {
                    name: 'fk_card_walletId',
                    columnNames: ['walletId'],
                    referencedTableName: 'wallet',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE'
                },
            ],
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'walletId',
                    type: 'int',
                },
                {
                    name: 'cardNumber',
                    type: 'varchar(255)',
                },
                {
                    name: 'ccv',
                    type: 'varchar(255)',
                },
                {
                    name: 'userId',
                    type: 'int',
                },
                {
                    name: 'isBlocked',
                    type: 'boolean',
                    default: false,
                },
            ]
        }));

        await queryRunner.createTable(new Table({
            name: 'transfer',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'amount',
                    type: 'double',
                    default: 0
                },
                {
                    name: 'originCurrency',
                    type: 'int',
                    default: 1,
                },
                {
                    name: 'targetCurrency',
                    type: 'int',
                    default: 1,
                },
                {
                    name: 'conversionFee',
                    type: 'float',
                    isNullable: true,
                },
                {
                    name: 'originEntityId',
                    type: 'int',
                },
                {
                    name: 'originEntityType',
                    type: 'int',
                    default: 1
                },
                {
                    name: 'targetEntityId',
                    type: 'int',
                },
                {
                    name: 'targetEntityType',
                    type: 'int',
                    default: 1
                },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('wallet');
    }

}
