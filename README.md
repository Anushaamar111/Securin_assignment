![image](https://github.com/user-attachments/assets/fd76490e-c13c-4779-969e-28ffee348896)# 🛡️ NVD CVE Dashboard - Securin Assignment

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

![WhatsApp Image 2025-06-15 at 14 33 41_717bd8f4](https://github.com/user-attachments/assets/803b4f55-48c1-4762-815e-fcca52175929)
![WhatsApp Image 2025-06-15 at 14 33 42_67a5af6b](https://github.com/user-attachments/assets/6a1c4b3e-5824-4364-a7c8-eb35a4e1ac38)
![WhatsApp Image 2025-06-15 at 14 33 42_59b101aa](https://github.com/user-attachments/assets/0ff46804-75a0-465f-9c42-408ec1624666)
![WhatsApp Image 2025-06-15 at 14 33 42_c78d5f74](https://github.com/user-attachments/assets/e6faae86-65ab-4553-babd-2aef694ef166)
![WhatsApp Image 2025-06-15 at 14 33 42_d023a3d1](https://github.com/user-attachments/assets/3ee01e0a-b5cc-45e4-83b5-0438352c8d4a)






