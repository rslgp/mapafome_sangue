
// import { useState } from 'react'
import BloodTypeToggle from './modules/config/BloodTypeToggle.jsx';
import MapView from './modules/donor/map/MapView.jsx'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the /donor route for MapView */}
        <Route path="/donor" element={<MapView />} />

        {/* Define the /config route for BloodTypeToggle */}
        <Route path="/config" element={<BloodTypeToggle />} />

        {/* Optionally add a fallback or default route */}
        <Route path="*" element={<div><Link to="/config">config</Link><MapView /></div>} />
      </Routes>
    </Router>
  )
}

export default App
