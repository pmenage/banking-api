import { IConfig } from './config.interface';

export const Config: IConfig = {
  dbConfig: {
    type: 'mysql',
    username: 'root',
    password: 'root',
    database: 'banking',
    host: 'localhost',
    port: 3306,
    autoSchemaSync: false,
    extra: {
      timezone: 'utc',
      timestamps: true,
      charset: 'UTF8',
      collate: 'UTF8_GENERAL_CI'
    },
    entities: [
      'modules/**/entity/*.entity.ts'
    ]
  },
};
