import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Grid3X3, ArrowLeft } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="studio-nav">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <Layout size={18} />
        <span>Single Flyer</span>
      </Link>
      <Link to="/grid" className={`nav-item ${location.pathname === '/grid' ? 'active' : ''}`}>
        <Grid3X3 size={18} />
        <span>Grid (3x4)</span>
      </Link>
      <Link to="/grid2x2" className={`nav-item ${location.pathname === '/grid2x2' ? 'active' : ''}`}>
        <Layout size={18} />
        <span>2x2 Grid</span>
      </Link>

      <style>{`
        .studio-nav {
          display: flex;
          background: #121212;
          border-bottom: 1px solid #333;
          padding: 0 1rem;
          gap: 1rem;
          height: 40px;
          align-items: center;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #888;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: bold;
          padding: 0 0.5rem;
          height: 100%;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .nav-item:hover {
          color: #fff;
        }

        .nav-item.active {
          color: var(--secondary);
          border-bottom-color: var(--secondary);
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
