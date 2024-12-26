import BloodTypeToggle from './modules/config/BloodTypeToggle.jsx';
import MapView from './modules/donor/map/MapView.jsx';
import './App.css';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <Router> {/* Use HashRouter */}
      <Routes>
        <Route path="/donor" element={<MapView />} />
        <Route path="/config" element={<BloodTypeToggle />} />
        <Route path="*" element={<div><Link to="/config">config</Link><MapView /></div>} />
      </Routes>
    </Router>
  );
}

export default App;