import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { CATEGORIES } from '../constants';

const MonthlyBudget = ({ expenses }) => {
  const [budgets, setBudgets] = useState(
    CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {})
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthExpensesList = expenses.filter(exp => {
    const d = new Date(exp.Date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const actualSpend = {};
  CATEGORIES.forEach(cat => { actualSpend[cat] = 0; });
  
  thisMonthExpensesList.forEach(exp => {
    if (actualSpend[exp.Category] === undefined) actualSpend[exp.Category] = 0;
    actualSpend[exp.Category] += parseFloat(exp.Amount || 0);
  });

  const handleBudgetChange = (category, value) => {
    setBudgets({ ...budgets, [category]: parseFloat(value) || 0 });
  };

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div style={{ backgroundColor: 'rgba(0, 86, 179, 0.15)', padding: '8px', borderRadius: '10px' }}>
            <Target size={24} className="text-blue" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Monthly Budget</h3>
        </div>
        <p style={{ color: 'var(--secondary-white)', fontSize: '0.9rem' }}>Set target spending limits</p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px', color: 'var(--secondary-white)', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '12px', color: 'var(--secondary-white)', fontWeight: 600 }}>Monthly Budget</th>
              <th style={{ padding: '12px', color: 'var(--secondary-white)', fontWeight: 600 }}>Actual Spend</th>
              <th style={{ padding: '12px', color: 'var(--secondary-white)', fontWeight: 600 }}>Difference</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map(category => {
              const budget = budgets[category];
              const spend = actualSpend[category];
              const diff = budget - spend;
              const isOver = diff < 0 && budget > 0;
              
              return (
                <tr key={category} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', fontWeight: 500 }}>{category}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '4px 8px', width: '120px' }}>
                      <span style={{ color: 'var(--secondary-white)', marginRight: '4px' }}>$</span>
                      <input 
                        type="number" 
                        value={budget || ''} 
                        onChange={(e) => handleBudgetChange(category, e.target.value)}
                        placeholder="0"
                        style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none' }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>${spend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '12px', color: isOver ? '#ff4b4b' : (diff > 0 ? '#00e676' : 'var(--primary-white)'), fontWeight: 600 }}>
                    {budget > 0 ? (diff >= 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyBudget;
