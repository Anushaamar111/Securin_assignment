import express from 'express';
import Cve from '../models/CVE.js';

const router = express.Router();

// 1. Get CVE by ID
router.get('/by-id/:id', async (req, res) => {
  try {
    const cve = await Cve.findOne({ cveId: req.params.id });
    if (!cve) return res.status(404).send('CVE not found');
    res.json(cve);
  } catch (err) {
    res.status(500).send('Error fetching CVE by ID');
  }
});

// 2. Get CVEs from a specific year
router.get('/by-year/:year', async (req, res) => {
  try {
    const year = req.params.year;
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${parseInt(year) + 1}-01-01`);

    const cves = await Cve.find({
      published: { $gte: start.toISOString(), $lt: end.toISOString() }
    });

    res.json(cves);
  } catch (err) {
    res.status(500).send('Error fetching CVEs by year');
  }
});

// 3. Get CVEs by baseScore (V3 first, fallback to V2)
router.get('/by-score/:score', async (req, res) => {
  try {
    const targetScore = parseFloat(req.params.score);

    const cves = await Cve.find({
      $or: [
        { 'metrics.cvssMetricV3.0.cvssData.baseScore': targetScore },
        { 'metrics.cvssMetricV2.cvssData.baseScore': targetScore }
      ]
    });

    res.json(cves);
  } catch (err) {
    res.status(500).send('Error fetching CVEs by score');
  }
});

// 4. Get CVEs modified in the last N days
router.get('/last-modified/:days', async (req, res) => {
  try {
    const days = parseInt(req.params.days);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const cves = await Cve.find({ lastModified: { $gte: since } });

    res.json(cves);
  } catch (err) {
    res.status(500).send('Error fetching CVEs by last modified date');
  }
});

router.get('/paginated', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || 'published';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const total = await Cve.countDocuments();
    const cves = await Cve.find()
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({ total, data: cves });
  } catch (err) {
    console.error(err);
    res.status(500).send('Pagination error');
  }
});


export default router;
