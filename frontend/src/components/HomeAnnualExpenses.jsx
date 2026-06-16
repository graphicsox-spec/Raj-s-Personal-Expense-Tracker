import React from 'react';
import { Home, PenTool } from 'lucide-react';

const HomeAnnualExpenses = () => {
  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div className="flex items-center gap-3 mb-6">
        <div style={{ backgroundColor: 'rgba(156, 39, 176, 0.15)', padding: '8px', borderRadius: '10px' }}>
          <Home size={24} style={{ color: '#9c27b0' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Home & Annual Expenses</h3>
      </div>
      <p style={{ color: 'var(--secondary-white)', marginBottom: '24px' }}>Track large one-off purchases, renovations, and annual bills.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{
          padding: '24px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>Home Renovations & Furniture</h4>
          <p style={{ color: 'var(--secondary-white)', fontSize: '0.9rem' }}>No data currently recorded. This module will integrate with the backend to track major home expenses separately from day-to-day spending.</p>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>Annual Renewals (Property Tax, Auto, etc.)</h4>
          <p style={{ color: 'var(--secondary-white)', fontSize: '0.9rem' }}>No data currently recorded. Upcoming annual bills will be highlighted here.</p>
        </div>
      </div>
    </div>
  );
};

export default HomeAnnualExpenses;
