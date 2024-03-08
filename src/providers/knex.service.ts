import knex, { Knex } from "knex";

export class KnexService {
  instance: Knex;

  constructor() {
    this.instance = knex({
      client: 'postgresql',
      connection: {
        host: '194.163.142.231',
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