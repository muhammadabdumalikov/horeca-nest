// import knex, { Knex } from "knex";

// export class KnexService {
//   instance: Knex;

//   constructor() {
//     this.instance = knex({
//       client: 'postgresql',
//       connection: {
//         host: 'tiny.db.elephantsql.com',
//         database: 'pdnbdcic',
//         password: 'cTRCHDyN5c2GQsegP4LEqz9Qoof-f7JS',
//         user: 'pdnbdcic',
//       },
//       pool: {
//         min: 1,
//         max: 3,
//       },
//     })
//   }
// }

import knex, { Knex } from "knex";

export class KnexService {
  instance: Knex;

  constructor() {
    this.instance = knex({
      client: 'postgresql',
      connection: {
        host: 'localhost',
        database: 'horeca',
        password: 'a1Gd6UnQdz6W',
        user: 'postgres',
      },
      pool: {
        min: 2,
        max: 75,
      },
    })
  }
}