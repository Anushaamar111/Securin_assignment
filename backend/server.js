import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cveRoutes from './routes/CVERoutes.js';
import fetchAndSaveCves from './services/fetchCVEData.js';
import cron from 'node-cron';
import cors from 'cors';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/cves', cveRoutes);

app.get('/', (req, res) => {
    res.send('NVD CVE Dashboard API is running');
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    cron.schedule('0 */6 * * *', async () => {
  console.log('🔄 Running scheduled CVE sync job...');
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
  await fetchAndSaveCves(0, 100, sixHoursAgo);  
});
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/cves/fetch', async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const resultsPerPage = parseInt(req.query.resultsPerPage) || 100;

    await fetchAndSaveCves(startIndex, resultsPerPage);
    res.send(`Fetched CVEs from index ${startIndex}`);
  } catch (err) {
    res.status(500).send('Error fetching CVEs');
    console.error(err);
  }
});

