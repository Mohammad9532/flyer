import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SingleFlyer from './pages/SingleFlyer';
import GridFlyer from './pages/GridFlyer';
import Grid2x2Flyer from './pages/Grid2x2Flyer';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-main-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navigation />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<SingleFlyer />} />
            <Route path="/grid" element={<GridFlyer />} />
            <Route path="/grid2x2" element={<Grid2x2Flyer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
