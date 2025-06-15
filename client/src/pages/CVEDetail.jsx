import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function CveDetail() {
  const { id } = useParams();
  const [cve, setCve] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/cves/by-id/${id}`)
      .then(res => res.json())
      .then(data => setCve(data))
      .catch(err => console.error('Error fetching CVE:', err));
  }, [id]);

  if (!cve) return <p className="p-4">Loading...</p>;

  const cvss = cve.metrics?.cvssMetricV2?.[0]?.cvssData;
  const score = cve.metrics?.cvssMetricV2?.[0];



  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{cve.cveId}</h1>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Description:</h2>
        <p className="text-sm text-gray-700">
          {cve.descriptions?.find(d => d.lang === 'en')?.value || 'No description available.'}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-800">CVSS V2 Metrics:</h2>
        {cvss ? (
          <>
            <div className="flex flex-wrap gap-4 text-sm mb-2">
              <p><strong>Severity:</strong> {score?.baseSeverity}</p>
              <p><strong>Score:</strong> <span className="text-red-600 font-bold">{cvss.baseScore}</span></p>
            </div>
            <p className="text-sm mb-2"><strong>Vector String:</strong> {cvss.vectorString}</p>

            <table className="w-full table-fixed border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Access Vector</th>
                  <th className="border p-2">Access Complexity</th>
                  <th className="border p-2">Authentication</th>
                  <th className="border p-2">Confidentiality Impact</th>
                  <th className="border p-2">Integrity Impact</th>
                  <th className="border p-2">Availability Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">{cvss.accessVector}</td>
                  <td className="border p-2">{cvss.accessComplexity}</td>
                  <td className="border p-2">{cvss.authentication}</td>
                  <td className="border p-2">{cvss.confidentialityImpact}</td>
                  <td className="border p-2">{cvss.integrityImpact}</td>
                  <td className="border p-2">{cvss.availabilityImpact}</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <p className="italic text-sm text-gray-500">No CVSS V2 data available.</p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Scores:</h2>
        <div className="text-sm text-gray-700">
          <p><strong>Exploitability Score:</strong> {score?.exploitabilityScore ?? 'N/A'}</p>
          <p><strong>Impact Score:</strong> {score?.impactScore ?? 'N/A'}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">CPE:</h2>
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Criteria</th>
              <th className="border p-2">Match Criteria ID</th>
              <th className="border p-2">Vulnerable</th>
            </tr>
          </thead>
          <tbody>
  {(cve.configurations || []).flatMap((config, i) =>
    (config.nodes || []).flatMap((node, j) =>
      (node.cpeMatch || []).map((cpe, k) => (
        <tr key={`${i}-${j}-${k}`}>
          <td className="border p-2">{cpe.criteria || 'N/A'}</td>
          <td className="border p-2">{cpe.matchCriteriaId || 'N/A'}</td>
          <td className="border p-2">{cpe.vulnerable ? 'Yes' : 'No'}</td>
        </tr>
      ))
    )
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}

export default CveDetail;
