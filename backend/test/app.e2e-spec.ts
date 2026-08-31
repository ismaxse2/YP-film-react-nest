import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { DataSource } from 'typeorm';

import { AppModule } from './../src/app.module';

describe('Film API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/afisha');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/afisha/films', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/afisha/films')
      .expect(200);

    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  it('GET /api/afisha/films/:id/schedule', async () => {
    const filmsResponse = await request(app.getHttpServer())
      .get('/api/afisha/films')
      .expect(200);

    const filmId = filmsResponse.body.items[0].id;

    const scheduleResponse = await request(app.getHttpServer())
      .get(`/api/afisha/films/${filmId}/schedule`)
      .expect(200);

    expect(scheduleResponse.body).toHaveProperty('total');
    expect(scheduleResponse.body).toHaveProperty('items');
    expect(Array.isArray(scheduleResponse.body.items)).toBe(true);
  });

  it('POST /api/afisha/order books a seat', async () => {
    const filmsResponse = await request(app.getHttpServer())
      .get('/api/afisha/films')
      .expect(200);

    const filmId = filmsResponse.body.items[0].id;

    const scheduleResponse = await request(app.getHttpServer())
      .get(`/api/afisha/films/${filmId}/schedule`)
      .expect(200);

    const schedule = scheduleResponse.body.items[0];

    const originalTaken: string[] = schedule.taken;

    let row = 1;
    let seat = 1;

    while (originalTaken.includes(`${row}:${seat}`) && row <= schedule.rows) {
      seat++;

      if (seat > schedule.seats) {
        row++;
        seat = 1;
      }
    }

    const place = `${row}:${seat}`;

    const order = {
      email: 'test@example.com',
      phone: '+79991234567',
      tickets: [
        {
          film: filmId,
          session: schedule.id,
          daytime: schedule.daytime,
          row,
          seat,
          price: schedule.price,
        },
      ],
    };

    try {
      const orderResponse = await request(app.getHttpServer())
        .post('/api/afisha/order')
        .send(order)
        .expect(201);

      expect(orderResponse.body.total).toBe(1);
      expect(orderResponse.body.items).toHaveLength(1);
      expect(orderResponse.body.items[0]).toHaveProperty('id');

      const updatedScheduleResponse = await request(app.getHttpServer())
        .get(`/api/afisha/films/${filmId}/schedule`)
        .expect(200);

      const updatedSchedule = updatedScheduleResponse.body.items.find(
        (item: { id: string }) => item.id === schedule.id,
      );

      expect(updatedSchedule.taken).toContain(place);

      await request(app.getHttpServer())
        .post('/api/afisha/order')
        .send(order)
        .expect(400);
    } finally {
      const dataSource = app.get(DataSource);

      await dataSource.query('UPDATE schedules SET taken = $1 WHERE id = $2', [
        originalTaken.join(','),
        schedule.id,
      ]);
    }
  });
});
