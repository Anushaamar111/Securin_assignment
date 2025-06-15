import axios from 'axios';
import Cve from '../models/CVE.js';

const BASE_URL = 'https://services.nvd.nist.gov/rest/json/cves/2.0';

async function fetchAndSaveCves(startIndex = 0, resultsPerPage = 100, lastModStartDate = null) {
  try {
    const params = {
      startIndex,
      resultsPerPage
    };

    if (lastModStartDate) {
      params.lastModStartDate = lastModStartDate;
    }

    const response = await axios.get(BASE_URL, { params });

    const vulnerabilities = response.data.vulnerabilities || [];

    for (const vuln of vulnerabilities) {
      const cve = vuln.cve;

      const cveData = {
        cveId: cve.id,
        descriptions: cve.descriptions,
        metrics: cve.metrics,
        published: cve.published,
        lastModified: cve.lastModified,
        references: cve.references,
        sourceIdentifier: cve.sourceIdentifier,
        vulnStatus: cve.vulnStatus,
        configurations: cve.configurations || [] 
      };

      await Cve.updateOne(
        { cveId: cve.id },
        cveData,
        { upsert: true }
      );
    }

    console.log(`Saved ${vulnerabilities.length} CVEs starting from index ${startIndex}`);
  } catch (error) {
    console.error('Error fetching CVEs:', error.message);
  }
}

export default fetchAndSaveCves;
