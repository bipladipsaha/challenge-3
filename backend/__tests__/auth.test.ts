import request from 'supertest';
import app from '../src/server';

jest.mock('../src/services/auth/auth.service', () => ({
  register: jest.fn().mockResolvedValue({
    user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
    accessToken: 'fakeAccessToken',
    refreshToken: 'fakeRefreshToken',
  }),
  login: jest.fn().mockResolvedValue({
    user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
    accessToken: 'fakeAccessToken',
    refreshToken: 'fakeRefreshToken',
  }),
  logout: jest.fn().mockResolvedValue(true),
}));

describe('Auth API Endpoints', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toEqual('success');
    expect(res.body.data.user.email).toEqual('test@example.com');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.headers['set-cookie']).toBeDefined();
  });
});
