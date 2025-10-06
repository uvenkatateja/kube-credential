import { Router, Request, Response } from 'express';
import { findCredential, insertCredential } from './db';

const router = Router();

interface CredentialRequest {
  id: string;
  [key: string]: any;
}

router.post('/issue', (req: Request, res: Response) => {
  try {
    const cred: CredentialRequest = req.body;
    
    if (!cred || !cred.id) {
      return res.status(400).json({ 
        error: 'credential must include id field' 
      });
    }

    const existing = findCredential(cred.id);
    const worker = process.env.WORKER_ID || 'worker-unknown';

    if (existing) {
      return res.status(200).json({ 
        message: 'credential already issued', 
        worker: existing.worker_id,
        issued_at: existing.issued_at
      });
    }

    insertCredential(cred.id, cred, worker);
    
    return res.status(201).json({ 
      message: `credential issued by ${worker}`, 
      worker,
      issued_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error issuing credential:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy', 
    service: 'issuance-service',
    worker: process.env.WORKER_ID || 'worker-unknown'
  });
});

export default router;