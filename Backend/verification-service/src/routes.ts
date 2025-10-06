import { Router, Request, Response } from 'express';
import { logVerification, getVerificationLogs } from './db';

const router = Router();

interface CredentialRequest {
  id: string;
  [key: string]: any;
}

// In-memory store for demo purposes (simulating shared state)
// In production, this would be a shared database or event store
const issuedCredentials = new Map<string, {
  id: string;
  payload: any;
  issued_at: string;
  worker_id: string;
}>();

router.post('/verify', (req: Request, res: Response) => {
  try {
    const cred: CredentialRequest = req.body;
    
    if (!cred || !cred.id) {
      return res.status(400).json({ 
        error: 'credential must include id field' 
      });
    }

    const worker = process.env.WORKER_ID || 'worker-unknown';
    const found = issuedCredentials.get(cred.id);

    if (!found) {
      logVerification(cred.id, worker, 'invalid');
      return res.status(404).json({ 
        valid: false,
        message: 'credential not found',
        worker
      });
    }

    logVerification(cred.id, worker, 'valid');
    
    return res.json({ 
      valid: true, 
      worker,
      issued_at: found.issued_at,
      issued_by: found.worker_id,
      verified_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error verifying credential:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Endpoint to sync credentials from issuance service (for demo)
router.post('/sync-credential', (req: Request, res: Response) => {
  try {
    const { id, payload, issued_at, worker_id } = req.body;
    
    if (!id || !payload || !issued_at || !worker_id) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    issuedCredentials.set(id, { id, payload, issued_at, worker_id });
    
    return res.json({ 
      message: 'credential synced successfully' 
    });
  } catch (error) {
    console.error('Error syncing credential:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

router.get('/logs', (req: Request, res: Response) => {
  try {
    const logs = getVerificationLogs();
    return res.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy', 
    service: 'verification-service',
    worker: process.env.WORKER_ID || 'worker-unknown'
  });
});

export default router;