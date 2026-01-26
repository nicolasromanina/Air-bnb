import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

export const CMSLayout: React.FC = () => {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div style={{display: 'flex', height: '100vh'}}>
      <aside style={{width: 260, borderRight: '1px solid #e5e7eb', padding: 16}}>
        <h3>Admin CMS</h3>
        <nav style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <Link to="/admin/home">Home</Link>
          <Link to="/admin/apartments">Apartments</Link>
          <Link to="/admin/apartment-detail">Apartment Detail</Link>
          <Link to="/admin/services">Services</Link>
        </nav>
        <div style={{marginTop: 20}}>
          <button onClick={() => setShowPreview(s => !s)}>{showPreview ? 'Hide' : 'Show'} Preview</button>
        </div>
      </aside>

      <main style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        <div style={{flex: 1, padding: 16, overflow: 'auto'}}>
          <Outlet />
        </div>
        {showPreview && (
          <div style={{height: 260, borderTop: '1px solid #e5e7eb'}}>
            <iframe title="preview" src="/" style={{width: '100%', height: '100%', border: 0}} />
          </div>
        )}
      </main>
    </div>
  );
};

export default CMSLayout;
