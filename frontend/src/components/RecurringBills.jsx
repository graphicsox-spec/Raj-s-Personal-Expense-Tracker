import React from 'react';
import { CalendarClock, Zap, Wifi } from 'lucide-react';

const RecurringBills = () => {
  // Placeholder data for recurring bills
  const bills = [
    { id: 1, name: 'Electricity', amount: 120, dueDate: '15th', status: 'Pending', icon: Zap },
    { id: 2, name: 'Internet', amount: 65, dueDate: '5th', status: 'Paid', icon: Wifi },
    { id: 3, name: 'Water', amount: 45, dueDate: '20th', status: 'Pending', icon: Zap },
  ];

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div className="flex items-center gap-3 mb-6">
        <div style={{ backgroundColor: 'rgba(255, 171, 0, 0.15)', padding: '8px', borderRadius: '10px' }}>
          <CalendarClock size={24} style={{ color: '#ffab00' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Recurring Bills</h3>
      </div>
      <p style={{ color: 'var(--secondary-white)', marginBottom: '24px' }}>Track your fixed monthly subscriptions and utilities.</p>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {bills.map(bill => (
          <div key={bill.id} className="flex items-center justify-between" style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div className="flex items-center gap-4">
              <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                <bill.icon size={20} color="var(--primary-white)" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>{bill.name}</h4>
                <span style={{ color: 'var(--secondary-white)', fontSize: '0.85rem' }}>Due on {bill.dueDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>${bill.amount.toFixed(2)}</span>
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '20px', 
                fontSize: '0.8rem', 
                fontWeight: 600,
                backgroundColor: bill.status === 'Paid' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 171, 0, 0.15)',
                color: bill.status === 'Paid' ? '#00e676' : '#ffab00'
              }}>
                {bill.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecurringBills;
