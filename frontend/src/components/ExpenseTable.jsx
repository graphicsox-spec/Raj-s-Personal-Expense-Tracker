import React from 'react';
import { Trash2, Edit2, CreditCard, Landmark, Coins, Smartphone, DollarSign } from 'lucide-react';
import { getCategoryIcon } from './CategoryIcon';

const getCategoryColor = (cat) => {
  const map = {
    'Event Material': { bg: 'rgba(0, 86, 179, 0.15)', text: '#66b2ff' },
    'Travel': { bg: 'rgba(0, 230, 118, 0.15)', text: '#00e676' },
    'Food & Beverages': { bg: 'rgba(255, 171, 0, 0.15)', text: '#ffab00' },
    'Vendor Payment': { bg: 'rgba(156, 39, 176, 0.15)', text: '#e1bee7' },
    'Logistics': { bg: 'rgba(0, 188, 212, 0.15)', text: '#b2ebf2' },
    'Office Supplies': { bg: 'rgba(255, 75, 75, 0.15)', text: '#ff4b4b' },
    'Other': { bg: 'rgba(255, 255, 255, 0.1)', text: '#e0e0e0' }
  };
  return map[cat] || map['Other'];
};

const getModeIcon = (mode) => {
  switch(mode) {
    case 'Credit Card': 
    case 'Debit Card': 
    case 'PayPal':
      return <CreditCard size={14} />;
    case 'Bank Transfer': 
    case 'Zelle':
      return <Landmark size={14} />;
    case 'Cash': 
      return <Coins size={14} />;
    case 'Zelle/Venmo': 
    case 'Venmo':
    case 'Apple Pay':
      return <Smartphone size={14} />;
    case 'Cash App':
      return <DollarSign size={14} />;
    default: return <CreditCard size={14} />;
  }
}

const ExpenseTable = ({ expenses, onDelete, onEdit }) => {
  if (expenses.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--secondary-white)', fontSize: '1.1rem' }}>No expenses found.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1rem 0' }}>Recent Transactions</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {expenses.map((expense) => {
          const catColor = getCategoryColor(expense.Category);
          const ModeIcon = getModeIcon(expense['Payment Mode']);
          
          return (
            <div key={expense.ID} className="glass-panel" style={{ 
              padding: '16px 20px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              border: '1px solid rgba(255,255,255,0.03)',
              backgroundColor: 'rgba(255,255,255,0.02)'
            }}
            >
              <div className="flex items-center gap-4">
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  backgroundColor: catColor.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: catColor.text
                }}>
                  {getCategoryIcon(expense.Category, 24, catColor.text)}
                </div>
                
                <div className="flex" style={{ flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary-white)' }}>
                    {expense.Category} {expense.Subcategory ? `- ${expense.Subcategory}` : ''}
                  </span>
                  <span style={{ color: 'var(--secondary-white)', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {new Date(expense.Date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    <span style={{ opacity: 0.3 }}>|</span>
                    {expense.Description || <span style={{ fontStyle: 'italic', opacity: 0.7 }}>No description</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--primary-white)' }}>
                    ${parseFloat(expense.Amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--secondary-white)', fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '100px' }}>
                    {ModeIcon}
                    {expense['Payment Mode']}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(expense)}
                    title="Edit Expense"
                    style={{ 
                      padding: '10px', 
                      borderRadius: '10px', 
                      border: 'none', 
                      backgroundColor: 'rgba(0, 170, 255, 0.1)',
                      color: '#00aaff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 170, 255, 0.2)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 170, 255, 0.1)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(expense.ID)}
                    title="Delete Expense"
                    style={{ 
                      padding: '10px', 
                      borderRadius: '10px', 
                      border: 'none', 
                      backgroundColor: 'rgba(255, 75, 75, 0.1)',
                      color: '#ff4b4b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 75, 75, 0.2)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 75, 75, 0.1)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseTable;
