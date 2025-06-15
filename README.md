# 🛡️ NVD CVE Dashboard - Securin Assignment

This full-stack application fetches, stores, filters, and displays CVE (Common Vulnerabilities and Exposures) data from the NVD API. It fulfills all requirements of the provided Securin assignment PDF, including data sync, filtering APIs, a React dashboard, and test cases.

---

## 📌 Assignment Requirements Covered

| # | Requirement                                                                                             | Status   |
|---|---------------------------------------------------------------------------------------------------------|----------|
| 1 | Consume CVE data from the NVD API and store in database                                                 | ✅ Done   |
| 2 | Fetch data in paginated chunks using `startIndex` and `resultsPerPage`                                 | ✅ Done   |
| 3 | Apply data cleansing & de-duplication during ingestion                                                  | ✅ Done   |
| 4 | Sync CVE details periodically (full or incremental sync every 6 hrs)                                    | ✅ Done   |
| 5 | Backend API to read & filter by: CVE ID, Year, Score, Last Modified                                     | ✅ Done   |
| 6 | Frontend to consume the API and visualize data                                                          | ✅ Done   |
| 7 | Frontend `/cves/list` route with total records, pagination, results-per-page dropdown                   | ✅ Done   |
| 8 | Server-side pagination and sorting by date                                                              | ✅ Done   |
| 9 | API documentation                                                                                        | ✅ Done   |
| 10| Unit test cases for backend API endpoints                                                               | ✅ Done   |

---

## 🏗️ Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| Frontend  | React + Vite + Tailwind |
| Backend   | Node.js + Express      |
| Database  | MongoDB + Mongoose     |
| Sync      | Axios + node-cron      |
| Testing   | Jest + Supertest       |


