import { Pool } from 'pg';

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


// for developmet testing
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    client.release();
    return {
      success: true,
      timestamp: result.rows[0].current_time,
      version: result.rows[0].postgres_version,
      message: 'Database connection successful'
    };
  } catch (error) {
    console.error('Database connection failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection failed'
    };
  }
}



export default pool;
