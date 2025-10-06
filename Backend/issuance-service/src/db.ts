import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.DB_PATH || './data/issuance.db';

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS credentials (
    id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    issued_at TEXT NOT NULL,
    worker_id TEXT NOT NULL
  )
`);

export interface Credential {
  id: string;
  payload: string;
  issued_at: string;
  worker_id: string;
}

export function findCredential(id: string): Credential | undefined {
  const row = db.prepare('SELECT * FROM credentials WHERE id = ?').get(id) as Credential;
  return row;
}

export function insertCredential(id: string, payload: any, workerId: string): void {
  const stmt = db.prepare('INSERT INTO credentials (id, payload, issued_at, worker_id) VALUES (?, ?, ?, ?)');
  stmt.run(id, JSON.stringify(payload), new Date().toISOString(), workerId);
}

export function listCredentials(): Credential[] {
  return db.prepare('SELECT * FROM credentials').all() as Credential[];
}

export default db;