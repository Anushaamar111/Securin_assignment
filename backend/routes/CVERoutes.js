import express from 'express';
import Cve from '../models/CVE.js';

const router = express.Router();

router.get('/paginated', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortField = 'published',
      sortOrder = 'desc',
      cveId,
      year,
      score,
      days
    } = req.query;

    const filters = {};

    if (cveId) {
      filters.cveId = { $regex: cveId, $options: 'i' };
    }

    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${parseInt(year) + 1}-01-01`);
      filters.published = { $gte: start, $lt: end };
    }

    if (score) {
      const baseScore = parseFloat(score);
      filters.$or = [
        { 'metrics.cvssMetricV3.0.cvssData.baseScore': baseScore },
        { 'metrics.cvssMetricV2.cvssData.baseScore': baseScore }
      ];
    }

    if (days) {
      const since = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
      filters.lastModified = { $gte: since };
    }

    const skip = (page - 1) * limit;
    const total = await Cve.countDocuments(filters);
    const data = await Cve.find(filters)
      .sort({ [sortField]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ total, data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing filter');
  }
});

// ...existing code...

// Get CVE by ID
router.get('/by-id/:id', async (req, res) => {
  try {
    const cve = await Cve.findOne({ cveId: req.params.id });
    if (!cve) return res.status(404).send('CVE not found');
    res.json(cve);
  } catch (err) {
    res.status(500).send('Error fetching CVE by ID');
  }
});

// Get CVEs by year
router.get('/by-year/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year + 1}-01-01`);
    const cves = await Cve.find({ published: { $gte: start, $lt: end } });
    res.json(cves);
  } catch (err) {
    res.status(500).send('Error fetching CVEs by year');
  }
});

// Get CVEs by score
router.get('/by-score/:score', async (req, res) => {
  try {
    const baseScore = parseFloat(req.params.score);
    const cves = await Cve.find({
      $or: [
        { 'metrics.cvssMetricV2.cvssData.baseScore': baseScore },
        { 'metrics.cvssMetricV3.cvssData.baseScore': baseScore }
      ]
    });
    res.json(cves);
  } catch (err) {
    res.status(500).send('Error fetching CVEs by score');
  }
});

// Get CVEs last modified in N days
router.get('/last-modified/:days', async (req, res) => {
  try {
    const days = parseInt(req.params.days);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const cves = await Cve.find({ lastModified: { $gte: since } });
    res.json(cves);
  } catch (err) {
    res.status(500).send('Error fetching CVEs by last modified');
  }
});

// ...existing code...

export default router;
