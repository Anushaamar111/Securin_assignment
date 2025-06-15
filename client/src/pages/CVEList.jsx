import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CveList() {
  const [cves, setCves] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('published');

  const [cveIdFilter, setCveIdFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [daysModified, setDaysModified] = useState('');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BASE = import.meta.env.VITE_BACKEND_URL;

  // Helper to fetch and set data
  // ...existing code...
const fetchData = async (url) => {
  setLoading(true);
  try {
    const res = await fetch(url);
    const data = await res.json();
    // If data is an array, use it. If it's an object (single CVE), wrap in array.
    if (Array.isArray(data)) {
      setCves(data);
      setTotal(data.length);
    } else if (data && data.data && Array.isArray(data.data)) {
      setCves(data.data);
      setTotal(data.total || data.data.length);
    } else if (data && data.cveId) {
      setCves([data]);
      setTotal(1);
    } else {
      setCves([]);
      setTotal(0);
    }
  } catch {
    setCves([]);
    setTotal(0);
  }
  setLoading(false);
};

  const handleCveIdFilter = () => {
    if (!cveIdFilter) return;
    fetchData(`${BASE}/cves/by-id/${cveIdFilter}`);
  };

  const handleYearFilter = () => {
    if (!yearFilter) return;
    fetchData(`${BASE}/cves/by-year/${yearFilter}`);
  };

  const handleScoreFilter = () => {
    if (!scoreFilter) return;
    fetchData(`${BASE}/cves/by-score/${scoreFilter}`);
  };

  const handleDaysModifiedFilter = () => {
    if (!daysModified) return;
    fetchData(`${BASE}/cves/last-modified/${daysModified}`);
  };

  // Pagination and sorting for default list
  const handleDefaultList = () => {
    const params = new URLSearchParams({
      page,
      limit,
      sortField,
      sortOrder
    });
    fetchData(`${BASE}/cves/paginated?${params.toString()}`);
  };

  
  useEffect(() => {
    if (!cveIdFilter && !yearFilter && !scoreFilter && !daysModified) {
      handleDefaultList();
    }
   
  }, [page, limit, sortField, sortOrder]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">CVE Dashboard</h1>

      <div className="flex gap-4 items-center flex-wrap">
        <select onChange={(e) => setLimit(parseInt(e.target.value))} value={limit} className="border p-1">
          <option value={10}>Results per page: 10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <button onClick={() => { setSortField('lastModified'); setPage(1); }} className="px-3 py-1 border rounded">Sort by Last Modified</button>
        <button onClick={() => { setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc'); setPage(1); }} className="px-3 py-1 border rounded">
          Order: {sortOrder.toUpperCase()}
        </button>
      </div>

      <div className="flex gap-4 items-center flex-wrap mt-2">
        <input placeholder="Filter by CVE ID" className="border p-1" value={cveIdFilter} onChange={(e) => setCveIdFilter(e.target.value)} />
        <button className="px-3 py-1 border rounded bg-blue-600 text-white" onClick={handleCveIdFilter}>Apply CVE ID</button>

        <input placeholder="Year" type="number" min="0" className="border p-1" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} />
        <button className="px-3 py-1 border rounded bg-blue-600 text-white" onClick={handleYearFilter}>Apply Year</button>

        <input placeholder="Score" type="number" step="any" className="border p-1" value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)} />
        <button className="px-3 py-1 border rounded bg-blue-600 text-white" onClick={handleScoreFilter}>Apply Score</button>

        <input placeholder="Modified in N days" type="number" min="0" className="border p-1" value={daysModified} onChange={(e) => setDaysModified(e.target.value)} />
        <button className="px-3 py-1 border rounded bg-blue-600 text-white" onClick={handleDaysModifiedFilter}>Apply Modified Days</button>

        <button onClick={() => {
          setCveIdFilter('');
          setYearFilter('');
          setScoreFilter('');
          setDaysModified('');
          setPage(1);
          handleDefaultList();
        }} className="px-3 py-1 border rounded text-red-600">
          Clear Filters
        </button>
      </div>

      <p>Total Records: {total}</p>

      {loading ? (
        <p className="text-blue-600 italic">Loading data...</p>
      ) : cves.length === 0 ? (
        <p className="text-gray-500 italic">No results found.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">CVE ID</th>
              <th className="border p-2">Published</th>
              <th className="border p-2">Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {cves.map(cve => (
              <tr key={cve.cveId} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/cves/${cve.cveId}`)}>
                <td className="border p-2">{cve.cveId}</td>
                <td className="border p-2">{cve.published ? new Date(cve.published).toLocaleDateString() : ''}</td>
                <td className="border p-2">{cve.lastModified ? new Date(cve.lastModified).toLocaleDateString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-3 py-1 border"
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 border"
          disabled={cves.length < limit}
        >
          Next
        </button>
        <span>Page: {page}</span>
      </div>
    </div>
  );
}

export default CveList;