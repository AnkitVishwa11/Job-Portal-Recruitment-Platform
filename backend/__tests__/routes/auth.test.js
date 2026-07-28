const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('Auth Routes', () => {
  const validUserData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'Password123!',
    role: 'jobseeker',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Registration successful');
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(validUserData.email);
      expect(res.body.data.user.password).toBeUndefined();
      expect(res.body.data.accessToken).toBeDefined();
      // refreshToken is set as an httpOnly cookie, not in response body
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should not register with existing email', async () => {
      await User.create(validUserData);

      const res = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already');
    });

    it('should not register without required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should not register with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUserData, email: 'invalid' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send(validUserData);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.email,
          password: validUserData.password,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      // refreshToken is returned as an httpOnly cookie
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.email,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/profile', () => {
    let accessToken;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUserData);
      accessToken = res.body.data.accessToken;
    });

    it('should get user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      // profile is returned as data.user (wrapped)
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(validUserData.email);
    });

    it('should not get profile without token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    let refreshTokenCookie;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUserData);
      // Extract the refresh token from the cookie header
      const cookies = res.headers['set-cookie'];
      if (cookies) {
        refreshTokenCookie = cookies.find((c) => c.startsWith('refreshToken='));
      }
    });

    it('should refresh token using cookie', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .set('Cookie', refreshTokenCookie || '')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      // New refresh token also set as cookie
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should not refresh with invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'invalid' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});
