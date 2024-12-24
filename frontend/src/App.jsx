
// import { useState } from 'react'
import BloodTypeToggle from './modules/BloodTypeToggle';
import './App.css'

function App() {
  return (
    <>
      <div className="App" style={{ fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Blood Type Selector</h1>
        <BloodTypeToggle />
      </div>
    </>
  )
}

export default App
