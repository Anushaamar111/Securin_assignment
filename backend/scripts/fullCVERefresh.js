import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fetchAndSaveCves from '../services/fetchCVEData.js';

dotenv.config();

const BATCH_SIZE = 100;
const MAX_CVES = 2000;

async function runFullRefresh() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(' Connected to MongoDB');

    for (let startIndex = 0; startIndex < MAX_CVES; startIndex += BATCH_SIZE) {
      await fetchAndSaveCves(startIndex, BATCH_SIZE);
    }

    console.log('All CVEs refreshed successfully!');
    process.exit(0);
  } catch (err) {
    console.error(' Error in full refresh:', err.message);
    process.exit(1);
  }
}

runFullRefresh();
