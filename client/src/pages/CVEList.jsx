import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CveList() {
  const [cves, setCves] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('published');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

useEffect(() => {
  fetch(`http://localhost:8000/cves/paginated?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`)
    .then(res => res.json())
    .then(data => {
      setCves(data.data);
      setTotal(data.total);
    })
    .catch(err => console.error('Error fetching CVEs:', err));
}, [page, limit, sortField, sortOrder]);


  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CVE LIST</h1>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Total Records: {total}</div>
        <div>
          <label htmlFor="limit" className="text-sm mr-2">Results per page:</label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); // reset to first page
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <table className="w-full table-fixed border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 cursor-pointer" onClick={() => toggleSort('cveId')}>CVE ID</th>
            <th className="border p-2">IDENTIFIER</th>
            <th className="border p-2 cursor-pointer" onClick={() => toggleSort('published')}>PUBLISHED DATE</th>
            <th className="border p-2 cursor-pointer" onClick={() => toggleSort('lastModified')}>LAST MODIFIED DATE</th>
            <th className="border p-2">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {cves.map(cve => (
            <tr
              key={cve._id}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/cves/${cve.cveId}`)}
            >
              <td className="border p-2">{cve.cveId}</td>
              <td className="border p-2">{cve.sourceIdentifier}</td>
              <td className="border p-2">{new Date(cve.published).toDateString()}</td>
              <td className="border p-2">{new Date(cve.lastModified).toDateString()}</td>
              <td className="border p-2">{cve.vulnStatus || 'Analyzed'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center items-center space-x-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-2 py-1 border rounded">
          ◀
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-2 py-1 border rounded ${page === i + 1 ? 'bg-blue-500 text-white' : ''}`}
          >
            {i + 1}
          </button>
        )).slice(0, 5)}
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-2 py-1 border rounded">
          ▶
        </button>
      </div>
    </div>
  );

  function toggleSort(field) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }
}

export default CveList;
