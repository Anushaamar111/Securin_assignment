import { Routes, Route, Navigate } from 'react-router-dom';
import CveList from './pages/CVEList';
import CveDetail from './pages/CVEDetail';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cves/list" />} />
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route path="/cves/list" element={<CveList />} />
      <Route path="/cves/:id" element={<CveDetail />} />
    </Routes>
  );
}

export default App;
