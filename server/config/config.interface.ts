export interface IDBConfig {
  name?: string;
  type: 'mysql' | 'mariadb';
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  autoSchemaSync: boolean;
  extra?: {
    timezone: string,
    timestamps: boolean,
    charset: string,
    collate: string
  };
  migrations?: string[];
  entities?: string[];
  cli?: {
    migrationsDir: string;
    entitiesDir: string;
  };
}

export interface IConfig {
  dbConfig: IDBConfig;
}
