import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import cveRoutes from '../routes/CVERoutes.js'; 
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use('/cves', cveRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});


test('GET /cves/by-id/CVE-1999-0095 should return CVE details', async () => {
  const res = await request(app).get('/cves/by-id/CVE-1999-0095');
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('cveId', 'CVE-1999-0095');
});


test('GET /cves/by-year/1999 should return an array', async () => {
  const res = await request(app).get('/cves/by-year/1999');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});


test('GET /cves/by-score/10 should return CVEs with baseScore 10', async () => {
  const res = await request(app).get('/cves/by-score/10');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});


test('GET /cves/last-modified/100 should return recent CVEs', async () => {
  const res = await request(app).get('/cves/last-modified/100');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});


test('GET /cves/paginated?page=1&limit=5 should return paginated results', async () => {
  const res = await request(app).get('/cves/paginated?page=1&limit=5');
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('total');
  expect(Array.isArray(res.body.data)).toBe(true);
});
