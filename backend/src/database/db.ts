import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  `postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${
    process.env.DB_HOST || 'localhost'
  }:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'nutrition_db'}`;

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 3000,
});

let isConnected = false;

pool.on('connect', () => {
  if (!isConnected) {
    console.log('Connected to PostgreSQL Database.');
    isConnected = true;
  }
});

pool.on('error', (err) => {
  console.warn('PostgreSQL pool warning/error (API will use in-memory fallback):', err.message);
  isConnected = false;
});

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (err: any) {
    return false;
  }
}
