import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CVEDetail() {
  const { cveId } = useParams();
  const navigate = useNavigate();
  const [cve, setCve] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`${BASE}/cves/by-id/${cveId}`)
      .then(res => {
        if (!res.ok) {
          setNotFound(true);
          setCve(null);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setCve(data);
          setNotFound(false);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching CVE:', err);
        setNotFound(true);
        setLoading(false);
      });
  }, [cveId, BASE]);

  if (loading) {
    return (
      <div className="p-6">
        <button className="mb-4 px-3 py-1 border rounded" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <p className="italic text-blue-600">Loading...</p>
      </div>
    );
  }

  if (notFound || !cve) {
    return (
      <div className="p-6">
        <button className="mb-4 px-3 py-1 border rounded" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <p className="text-red-600">CVE not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <button className="mb-4 px-3 py-1 border rounded" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="text-xl font-bold mb-2">{cve.cveId}</h2>
      <div>
        <strong>Published:</strong>{' '}
        {cve.published ? new Date(cve.published).toLocaleDateString() : 'N/A'}
      </div>
      <div>
        <strong>Last Modified:</strong>{' '}
        {cve.lastModified ? new Date(cve.lastModified).toLocaleDateString() : 'N/A'}
      </div>
      <div>
        <strong>Description:</strong>{' '}
        {cve.descriptions && cve.descriptions.length > 0
          ? cve.descriptions[0].value
          : 'N/A'}
      </div>
      <div>
        <strong>CVSS v3 Score:</strong>{' '}
        {cve.metrics && cve.metrics.cvssMetricV3 && cve.metrics.cvssMetricV3.cvssData
          ? cve.metrics.cvssMetricV3.cvssData.baseScore
          : 'N/A'}
      </div>
      <div>
        <strong>CVSS v2 Score:</strong>{' '}
        {cve.metrics && cve.metrics.cvssMetricV2 && cve.metrics.cvssMetricV2.cvssData
          ? cve.metrics.cvssMetricV2.cvssData.baseScore
          : 'N/A'}
      </div>
      {cve.references && cve.references.length > 0 && (
        <div>
          <strong>References:</strong>
          <ul className="list-disc ml-6">
            {cve.references.map((ref, idx) => (
              <li key={idx}>
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                  {ref.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CVEDetail;