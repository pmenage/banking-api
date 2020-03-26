# Banking API

## Prerequisites
- Node.js 12.16.1
- npm 6.13.4
- MySQL

## Setup

Create a database called banking.

If needed, change the configuration in `config/dev.config.ts` and `config/orm.config.ts`.

Run `npm install` to install the dependencies.

Run `npm run build` to build the project.

Run `npm run mig-up` to migrate the database.

## Start

Run `npm start`.

## Test

Run `npm test`.

## Documentation

The documentation is available on localhost:8888/api/docs.

## Note

The enums are not available as strings yet in the objects but as numbers.

For example, the body to create a request should be:

```
{
	"currency": 1,
	"currentBalance": 400
}
```

instead of:

```
{
	"currency": "EUR",
	"currentBalance": 400
}
```