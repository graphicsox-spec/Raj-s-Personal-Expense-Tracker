import React from 'react';
import { CreditCard } from 'lucide-react';

const CreditCards = () => {
  const cards = [
    { id: 1, name: 'Chase Sapphire', balance: 1250.00, limit: 10000, lastFour: '4092' },
    { id: 2, name: 'Amex Gold', balance: 450.00, limit: 15000, lastFour: '1005' },
    { id: 3, name: 'Discover It', balance: 0.00, limit: 5000, lastFour: '9921' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div className="flex items-center gap-3 mb-6">
        <div style={{ backgroundColor: 'rgba(0, 188, 212, 0.15)', padding: '8px', borderRadius: '10px' }}>
          <CreditCard size={24} style={{ color: '#00bcd4' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Credit Card Tracker</h3>
      </div>
      <p style={{ color: 'var(--secondary-white)', marginBottom: '24px' }}>Monitor balances across all your credit cards.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {cards.map(card => (
          <div key={card.id} style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
              <CreditCard size={120} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600 }}>{card.name}</h4>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ color: 'var(--secondary-white)', fontSize: '0.85rem' }}>Current Balance</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-white)' }}>
                  ${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--secondary-white)', fontSize: '0.9rem', letterSpacing: '2px' }}>•••• {card.lastFour}</span>
                <span style={{ color: 'var(--secondary-white)', fontSize: '0.85rem' }}>Limit: ${card.limit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditCards;
