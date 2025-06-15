## 📘 7. API Documentation

### ✅ Base URL

```
http://localhost:8000
```

---

### 🔹 1. `GET /cves/fetch`

**Description:** Fetch CVEs from the NVD API and store them in the database.

**Query Parameters:**
- `startIndex` (default: 0) – pagination start index
- `resultsPerPage` (default: 100) – number of CVEs per request

**Example:**
```
GET /cves/fetch?startIndex=0&resultsPerPage=50
```

---

### 🔹 2. `GET /cves/by-id/:id`

**Description:** Retrieve details of a CVE by its ID.

**Example:**
```
GET /cves/by-id/CVE-1999-0095
```

---

### 🔹 3. `GET /cves/by-year/:year`

**Description:** Retrieve all CVEs published in a specific year.

**Example:**
```
GET /cves/by-year/2023
```

---

### 🔹 4. `GET /cves/by-score/:score`

**Description:** Retrieve CVEs with a specific CVSS base score.

**Example:**
```
GET /cves/by-score/9.8
```

---

### 🔹 5. `GET /cves/last-modified/:days`

**Description:** Retrieve CVEs modified in the last N days.

**Example:**
```
GET /cves/last-modified/30
```

---

### 🔹 6. `GET /cves/paginated`

**Description:** Get a paginated list of CVEs, with optional sorting.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `sortField` (optional): e.g., `published`, `lastModified`
- `sortOrder` (optional): `asc` or `desc`

**Example:**
```
GET /cves/paginated?page=2&limit=50&sortField=published&sortOrder=desc
```

**Response:**
```json
{
  "total": 2000,
  "data": [
    {
      "cveId": "CVE-1999-0095",
      "published": "1999-04-10T00:00:00Z"
    }
  ]
}
```

---

## 🧪 8. Unit Testing Documentation

### ✅ Tools Used

- **Jest**: JavaScript testing framework
- **Supertest**: HTTP testing for Express routes

---

### ✅ Test File Location

```
backend/test/CVERoute.test.js
```

---

### ✅ How to Run the Tests

1. Make sure your `.env` file contains a valid `MONGO_URI`.
2. In the `backend/` directory, run:

```bash
npm run test
```

---

### ✅ What Is Being Tested

| Endpoint                         | Description                           |
|----------------------------------|---------------------------------------|
| `GET /cves/by-id/:id`            | Fetch a CVE by ID                     |
| `GET /cves/by-year/:year`        | Fetch CVEs from a specific year       |
| `GET /cves/by-score/:score`      | Filter CVEs by CVSS base score        |
| `GET /cves/last-modified/:days`  | Fetch recently modified CVEs          |
| `GET /cves/paginated`            | Fetch paginated CVE list with sorting |

---

### ✅ Example Unit Test (Jest + Supertest)

```js
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cveRoutes from '../src/routes/cveRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/cves', cveRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

test('GET /cves/by-id/CVE-1999-0095 should return CVE details', async () => {
  const res = await request(app).get('/cves/by-id/CVE-1999-0095');
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('cveId', 'CVE-1999-0095');
});

test('GET /cves/by-year/2023 should return an array', async () => {
  const res = await request(app).get('/cves/by-year/2023');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET /cves/by-score/10 should return CVEs', async () => {
  const res = await request(app).get('/cves/by-score/10');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET /cves/last-modified/30 should return recent CVEs', async () => {
  const res = await request(app).get('/cves/last-modified/30');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET /cves/paginated?page=1&limit=5 should return paginated results', async () => {
  const res = await request(app).get('/cves/paginated?page=1&limit=5');
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('total');
  expect(Array.isArray(res.body.data)).toBe(true);
});
```