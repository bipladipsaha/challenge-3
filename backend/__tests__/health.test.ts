import request from 'supertest';
import express from 'express';
import app from '../src/server'; // assuming server exports app

describe('Health Check API', () => {
  it('should return 200 OK for /api/v1/health', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
    expect(res.body.version).toEqual('v1');
  });

  it('should return 200 OK for root /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
  });
});
