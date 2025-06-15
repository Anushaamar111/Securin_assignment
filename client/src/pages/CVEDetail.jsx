import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CVEDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cve, setCve] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    fetch(`${BASE}/cves/by-id/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('CVE not found');
        return res.json();
      })
      .then(data => {
        setCve(data);
        setLoading(false);
      })
      .catch(() => {
        setCve(null);
        setNotFound(true);
        setLoading(false);
      });
  }, [id, BASE]);

  const getCvssV2 = () => {
    const metric = cve.metrics?.cvssMetricV2?.[0];
    return {
      ...metric?.cvssData,
      exploitabilityScore: metric?.exploitabilityScore ?? 'N/A',
      impactScore: metric?.impactScore ?? 'N/A',
    };
  };

  const getCPEs = () => {
    return cve.configurations?.[0]?.nodes?.[0]?.cpeMatch || [];
  };

  if (loading) {
    return (
      <div className="p-6">
        <button className="mb-4 px-3 py-1 border rounded" onClick={() => navigate(-1)}>&larr; Back</button>
        <p className="italic text-blue-600">Loading...</p>
      </div>
    );
  }

  if (notFound || !cve) {
    return (
      <div className="p-6">
        <button className="mb-4 px-3 py-1 border rounded" onClick={() => navigate(-1)}>&larr; Back</button>
        <p className="text-red-600">CVE not found.</p>
      </div>
    );
  }

  const v2 = getCvssV2();

  return (
    <div className="p-6 space-y-4">
      <button className="mb-4 px-3 py-1 border rounded" onClick={() => navigate(-1)}>&larr; Back</button>

      <h2 className="text-2xl font-bold">{cve.cveId}</h2>

      <div className="space-y-1">
        <p><strong>Description:</strong> {cve.descriptions?.[0]?.value || 'N/A'}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mt-6">CVSS V2 Metrics:</h3>
        <p>
          <strong>Severity:</strong> <span className="text-red-600 font-bold">HIGH</span> &nbsp;
          <strong>Score:</strong> <span className="text-red-600 font-bold">{v2.baseScore ?? 'N/A'}</span>
        </p>
        <p><strong>Vector String:</strong> {v2.vectorString || 'N/A'}</p>

        <table className="w-full mt-3 border border-gray-300 text-sm">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <td className="border px-2 py-1">Access Vector</td>
              <td className="border px-2 py-1">Access Complexity</td>
              <td className="border px-2 py-1">Authentication</td>
              <td className="border px-2 py-1">Confidentiality Impact</td>
              <td className="border px-2 py-1">Integrity Impact</td>
              <td className="border px-2 py-1">Availability Impact</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">{v2.accessVector || 'N/A'}</td>
              <td className="border px-2 py-1">{v2.accessComplexity || 'N/A'}</td>
              <td className="border px-2 py-1">{v2.authentication || 'N/A'}</td>
              <td className="border px-2 py-1">{v2.confidentialityImpact || 'N/A'}</td>
              <td className="border px-2 py-1">{v2.integrityImpact || 'N/A'}</td>
              <td className="border px-2 py-1">{v2.availabilityImpact || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mt-4">Scores:</h3>
        <p><strong>Exploitability Score:</strong> {v2.exploitabilityScore}</p>
        <p><strong>Impact Score:</strong> {v2.impactScore}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mt-4">CPE:</h3>
        <table className="w-full mt-2 border border-gray-300 text-sm">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <td className="border px-2 py-1">Criteria</td>
              <td className="border px-2 py-1">Match Criteria ID</td>
              <td className="border px-2 py-1">Vulnerable</td>
            </tr>
          </thead>
          <tbody>
            {getCPEs().map((cpe, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{cpe.criteria}</td>
                <td className="border px-2 py-1">{cpe.matchCriteriaId}</td>
                <td className="border px-2 py-1">{cpe.vulnerable ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CVEDetail;
