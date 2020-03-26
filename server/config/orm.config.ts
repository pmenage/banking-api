const dbConfig = {
    name: 'default',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'banking',
    autoSchemaSync: false,
    migrations: [
        'bin/migrations/*.js'
    ],
    'entities': [
        'bin/modules/**/entity/*.entity.js'
    ],
    cli: {
        migrationsDir: 'bin/migrations/*.js',
        entitiesDir: 'bin/modules/**/entity/*.entity.js'
    }
};

export = dbConfig;
