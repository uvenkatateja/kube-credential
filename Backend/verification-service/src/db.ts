import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const DB_PATH = process.env.DB_PATH || './data/verification.db';
const ISSUANCE_SERVICE_URL = process.env.ISSUANCE_SERVICE_URL || 'http://issuance-service:3001';

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Initialize database schema for verification logs
db.exec(`
  CREATE TABLE IF NOT EXISTS verification_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    credential_id TEXT NOT NULL,
    verified_at TEXT NOT NULL,
    worker_id TEXT NOT NULL,
    result TEXT NOT NULL
  )
`);

export interface VerificationLog {
  id: number;
  credential_id: string;
  verified_at: string;
  worker_id: string;
  result: string;
}

export interface IssuedCredential {
  id: string;
  payload: string;
  issued_at: string;
  worker_id: string;
}

export function logVerification(credentialId: string, workerId: string, result: string): void {
  const stmt = db.prepare('INSERT INTO verification_logs (credential_id, verified_at, worker_id, result) VALUES (?, ?, ?, ?)');
  stmt.run(credentialId, new Date().toISOString(), workerId, result);
}

export function getVerificationLogs(): VerificationLog[] {
  return db.prepare('SELECT * FROM verification_logs ORDER BY verified_at DESC').all() as VerificationLog[];
}

// For demo purposes, we'll also check against issuance service
// In production, services would share a database or use event sourcing
export async function checkCredentialWithIssuanceService(credentialId: string): Promise<IssuedCredential | null> {
  try {
    // This is a simplified approach - in production you'd have proper service discovery
    const response = await axios.get(`${ISSUANCE_SERVICE_URL}/health`);
    if (response.status === 200) {
      // For demo, we'll assume the credential exists if issuance service is healthy
      // In real implementation, you'd have a proper lookup endpoint
      return null; // Placeholder - would implement proper lookup
    }
  } catch (error) {
    console.warn('Could not reach issuance service:', error);
  }
  return null;
}

export default db;