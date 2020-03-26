import { injectable } from 'inversify';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import * as dbConfig from './orm.config';

@injectable()
export default class DatabaseProvider {
  public db: Connection;

  async getDBConnection(): Promise<Connection> {
    try {
      if (!this.db) {
        const config: ConnectionOptions = <ConnectionOptions>dbConfig;
        const db = await createConnection(config);
        if (db) {
          this.db = db;
        }
      }
      return this.db;
    }
    catch (error) {
      throw error;
    }
  }

}
