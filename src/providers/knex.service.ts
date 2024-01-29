// import knex, { Knex } from "knex";

// export class KnexService {
//   instance: Knex;

//   constructor() {
//     this.instance = knex({
//       client: 'postgresql',
//       connection: {
//         host: 'rain.db.elephantsql.com',
//         database: 'jsskmqpe',
//         password: 'IIWPSMjS-Y4bxIR5F7MqRUhDm0eAnVxq',
//         user: 'jsskmqpe',
//       },
//       pool: {
//         min: 1,
//         max: 3,
//       },
//     })
//   }
// }

import knex, { Knex } from 'knex';

export class KnexService {
  instance: Knex;

  constructor() {
    this.instance = knex({
      client: 'postgresql',
      connection: {
        host: 'localhost',
        database: 'store',
        password: '5432',
        user: 'postgres',
      },
      pool: {
        min: 2,
        max: 75,
      },
    });
  }
}
