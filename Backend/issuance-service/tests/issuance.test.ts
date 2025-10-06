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

describe('Issuance API', () => {
  it('should issue a new credential', async () => {
    const cred = { id: 'test-1', name: 'Alice', type: 'identity' };
    const res = await request(app)
      .post('/issue')
      .send(cred);
    
    expect(res.status).to.be.oneOf([200, 201]);
    expect(res.body).to.have.property('worker');
    expect(res.body).to.have.property('message');
  });

  it('should return already issued for duplicate credential', async () => {
    const cred = { id: 'test-duplicate', name: 'Bob' };
    
    // First issuance
    await request(app)
      .post('/issue')
      .send(cred);
    
    // Second issuance (should return already issued)
    const res = await request(app)
      .post('/issue')
      .send(cred);
    
    expect(res.status).to.equal(200);
    expect(res.body.message).to.include('already issued');
  });

  it('should return error for credential without id', async () => {
    const cred = { name: 'Charlie' }; // Missing id
    const res = await request(app)
      .post('/issue')
      .send(cred);
    
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('should return health status', async () => {
    const res = await request(app).get('/health');
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'healthy');
    expect(res.body).to.have.property('service', 'issuance-service');
  });
});