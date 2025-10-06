import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../src/routes';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/', routes);

describe('Verification API', () => {
  it('should return invalid for non-existent credential', async () => {
    const cred = { id: 'non-existent', name: 'Alice' };
    const res = await request(app)
      .post('/verify')
      .send(cred);
    
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('valid', false);
    expect(res.body).to.have.property('worker');
  });

  it('should verify credential after syncing', async () => {
    const credId = 'test-sync-1';
    
    // First sync a credential
    await request(app)
      .post('/sync-credential')
      .send({
        id: credId,
        payload: { name: 'Bob' },
        issued_at: new Date().toISOString(),
        worker_id: 'worker-1'
      });
    
    // Then verify it
    const res = await request(app)
      .post('/verify')
      .send({ id: credId });
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('valid', true);
    expect(res.body).to.have.property('worker');
    expect(res.body).to.have.property('issued_at');
  });

  it('should return error for credential without id', async () => {
    const cred = { name: 'Charlie' }; // Missing id
    const res = await request(app)
      .post('/verify')
      .send(cred);
    
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('should return health status', async () => {
    const res = await request(app).get('/health');
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'healthy');
    expect(res.body).to.have.property('service', 'verification-service');
  });

  it('should fetch verification logs', async () => {
    const res = await request(app).get('/logs');
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('logs');
    expect(res.body.logs).to.be.an('array');
  });
});