import { Pool, PoolClient, QueryResult } from 'pg';


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}


export async function getClient() {
  return await pool.connect();
}

// New: transaction helpers using pg-transaction (promise wrappers)
type TrxWrapper = {
  client: PoolClient;
  begin: () => Promise<void>;
  query: (text: string, params?: any[]) => Promise<QueryResult>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
};

export async function startTransaction(): Promise<TrxWrapper> {
  const client = await pool.connect();
  // pg-transaction expects to be constructed with the raw client
  const trx: any = new tx(client);

  const begin = (): Promise<void> =>
    new Promise((resolve, reject) => {
      trx.begin((err: Error | null) => {
        if (err) {
          client.release();
          return reject(err);
        }
        resolve();
      });
    });

  const query = (text: string, params?: any[]): Promise<QueryResult> =>
    new Promise((resolve, reject) => {
      // pg-transaction query signature: trx.query(sql, params, cb)
      trx.query(text, params || [], (err: Error | null, result?: QueryResult) => {
        if (err) return reject(err);
        resolve(result as QueryResult);
      });
    });

  const commit = (): Promise<void> =>
    new Promise((resolve, reject) => {
      trx.commit((err: Error | null) => {
        // always release client after commit attempt
        try {
          client.release();
        } catch (e) {
          // ignore release errors
        }
        if (err) return reject(err);
        resolve();
      });
    });

  const rollback = (): Promise<void> =>
    new Promise((resolve, reject) => {
      trx.rollback((err: Error | null) => {
        // always release client after rollback attempt
        try {
          client.release();
        } catch (e) {
          // ignore release errors
        }
        if (err) return reject(err);
        resolve();
      });
    });

  return { client, begin, query, commit, rollback };
}

/**
 * Run an async function inside a transaction. The provided callback receives
 * the trx wrapper (query/commit/rollback) and can perform queries using trx.query.
 * The transaction is committed if the callback resolves, rolled back if it throws.
 */
export async function withTransaction<T>(fn: (trx: TrxWrapper) => Promise<T>): Promise<T> {
  const trx = await startTransaction();
  await trx.begin();
  try {
    const result = await fn(trx);
    await trx.commit();
    return result;
  } catch (err) {
    try {
      await trx.rollback();
    } catch {
      // swallow rollback errors but rethrow original
    }
    throw err;
  }
}

export default pool;
