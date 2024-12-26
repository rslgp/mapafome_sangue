import BloodTypeToggle from './modules/config/BloodTypeToggle.jsx';
import MapView from './modules/donor/map/MapView.jsx';
import './App.css';
import { HashRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function RedirectToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/' && !location.hash) {
      window.location.replace(`/#${location.pathname}`);
    } else if (location.pathname === '/' && !location.hash) {
      window.location.replace('/#/')
    }
  }, [location]);

  return null; // This component doesn't render anything
}

function App() {
  return (
    <Router>
      <RedirectToHash /> {/* Add the redirect component */}
      <Routes>
        <Route path="*" element={<MapView />} />
        <Route path="/config" element={<div><Link to="/admin">map</Link><BloodTypeToggle /></div>} />
        <Route path="/admin" element={<div><Link to="/config">config</Link><MapView /></div>} />{/* No #/ here */}
      </Routes>
    </Router>
  );
}

export default App;