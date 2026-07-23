const request = require('supertest');
const app = require('../../src/app');

describe('Health Check', () => {
  it('GET /api/health should return 200', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('API is running');
    expect(res.body.data).toBeDefined();
    expect(res.body.data.environment).toBeDefined();
    expect(res.body.data.timestamp).toBeDefined();
  });
});


