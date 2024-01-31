import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PoolService {
  public readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionTimeoutMillis: parseInt(process.env.POOL_TIMEOUT || '30000'),
      max: parseInt(process.env.MAX_POOL || '100'),
      application_name: `horeca-api: ${new Date().getTime()}`,
      port: Number(process.env.PGPORT),
    });
  }

  getReadPool() {
    const pool = new Pool({
      connectionTimeoutMillis: parseInt(process.env.POOL_TIMEOUT || '2000'),
      idleTimeoutMillis: 30000,
      max: parseInt(process.env.MAX_POOL || '100'),
      application_name: `horeca-api: ${new Date().getTime()}`,
      port: Number(process.env.READ_PGPORT),
    });

    return pool;
  }

  getPool() {
    const pool = new Pool({
      connectionTimeoutMillis: parseInt(process.env.POOL_TIMEOUT || '30000'),
      max: parseInt(process.env.MAX_POOL || '100'),
      application_name: `horeca-api: ${new Date().getTime()}`,
      port: Number(process.env.PGPORT),
    });

    return pool;
  }

  onModuleDestroy() {
    this.pool.end();
  }
}
