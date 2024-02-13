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

// import knex, { Knex } from 'knex';

// export class KnexService {
//   instance: Knex;

//   constructor() {
//     this.instance = knex({
//       client: 'postgresql',
//       connection: {
//         host: 'localhost',
//         database: 'store',
//         password: '5432',
//         user: 'postgres',
//       },
//       pool: {
//         min: 2,
//         max: 75,
//       },
//     });
//   }
// }
