import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; // 👈 adjust if your root module is named differently

describe('App E2E', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // (Optional) login to get JWT
    const loginRes = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });

    token = loginRes.body.access_token; // adjust field if needed
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/categories (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/categories')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/v1/categories (POST) [ADMIN only]', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'E2E Test Category' })
      .expect(201);

    expect(res.body.name).toBe('E2E Test Category');
  });

  it('/v1/products/search (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/products/search?query=milk')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
