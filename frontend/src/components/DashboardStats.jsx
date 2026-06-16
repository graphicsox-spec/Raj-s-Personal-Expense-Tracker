import React from 'react';
import { DollarSign, TrendingUp, Calendar, Activity, Home, PiggyBank, CreditCard } from 'lucide-react';
import { CATEGORIES } from '../constants';

const DashboardStats = ({ expenses = [], budget = [], creditCards = [], income = 0 }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthExpensesList = expenses.filter(exp => {
    const d = new Date(exp.Date);
    // Be careful with parsing if Date is missing or malformed
    if (isNaN(d.getTime())) return false;
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const thisMonthExpense = thisMonthExpensesList.reduce((sum, exp) => sum + parseFloat(exp.Amount || 0), 0);
  
  // Calculate Mortgage + Utilities for this month
  const mortgageAndUtilities = thisMonthExpensesList
    .filter(exp => exp.Category === 'Mortgage' || exp.Category === 'Utilities')
    .reduce((sum, exp) => sum + parseFloat(exp.Amount || 0), 0);

  const savings = income - thisMonthExpense;
  
  const creditCardBalances = creditCards.reduce((sum, card) => sum + parseFloat(card['Current Balance'] || 0), 0);
  
  const totalBudget = budget.reduce((sum, b) => sum + parseFloat(b['Monthly Budget'] || 0), 0);
  const remainingBudget = totalBudget - thisMonthExpense;

  // Prepare data for Top Spending Areas
  const categoryTotals = {};
  CATEGORIES.forEach(cat => { categoryTotals[cat] = 0; });
  
  thisMonthExpensesList.forEach(exp => {
    if (categoryTotals[exp.Category] === undefined) {
      categoryTotals[exp.Category] = 0;
    }
    categoryTotals[exp.Category] += parseFloat(exp.Amount || 0);
  });

  const chartData = Object.keys(categoryTotals)
    .map(key => ({ name: key, value: categoryTotals[key] }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="dashboard-stats" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
      
      {/* High-Level Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        
        <div className="glass-panel stat-card" style={{ padding: '20px' }}>
          <div className="flex items-center gap-3 mb-2">
            <div style={{ backgroundColor: 'rgba(0, 230, 118, 0.15)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <DollarSign size={20} className="text-green" />
            </div>
            <span style={{ color: 'var(--secondary-white)', fontSize: '0.9rem', fontWeight: 600 }}>Monthly Income</span>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-white)' }}>
            ${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '20px' }}>
          <div className="flex items-center gap-3 mb-2">
            <div style={{ backgroundColor: 'rgba(255, 75, 75, 0.15)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={20} className="text-red" />
            </div>
            <span style={{ color: 'var(--secondary-white)', fontSize: '0.9rem', fontWeight: 600 }}>This Month's Spend</span>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-white)' }}>
            ${thisMonthExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '20px' }}>
          <div className="flex items-center gap-3 mb-2">
            <div style={{ backgroundColor: 'rgba(0, 188, 212, 0.15)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PiggyBank size={20} style={{ color: '#00bcd4' }} />
            </div>
            <span style={{ color: 'var(--secondary-white)', fontSize: '0.9rem', fontWeight: 600 }}>Savings (This Month)</span>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: savings < 0 ? '#ff4b4b' : 'var(--primary-white)' }}>
            ${savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '20px' }}>
          <div className="flex items-center gap-3 mb-2">
            <div style={{ backgroundColor: 'rgba(255, 171, 0, 0.15)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CreditCard size={20} style={{ color: '#ffab00' }} />
            </div>
            <span style={{ color: 'var(--secondary-white)', fontSize: '0.9rem', fontWeight: 600 }}>Total CC Balances</span>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-white)' }}>
            ${creditCardBalances.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

      </div>

      {/* Secondary Row */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr 1.5fr' }}>
        
        <div className="glass-panel stat-card" style={{ padding: '24px' }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ backgroundColor: 'rgba(156, 39, 176, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Home size={24} style={{ color: '#9c27b0' }} />
            </div>
            <span className="stat-title">Mortgage + Utilities</span>
          </div>
          <span className="stat-value">${mortgageAndUtilities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <p style={{ marginTop: '8px', color: 'var(--secondary-white)', fontSize: '0.85rem' }}>Fixed housing costs this month</p>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '24px' }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ backgroundColor: 'rgba(0, 86, 179, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Activity size={24} className="text-blue" />
            </div>
            <span className="stat-title">Remaining Budget</span>
          </div>
          <span className="stat-value" style={{ color: remainingBudget < 0 ? '#ff4b4b' : 'var(--primary-white)' }}>
            ${remainingBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <p style={{ marginTop: '8px', color: 'var(--secondary-white)', fontSize: '0.85rem' }}>
            Total Budget: ${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </p>
        </div>
        
        <div className="glass-panel stat-card" style={{ padding: '24px' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-red" />
            <span className="stat-title">Top 3 Spending Areas</span>
          </div>
          <div className="flex" style={{ flexDirection: 'column', gap: '0.75rem' }}>
            {chartData.slice(0, 3).map((item, index) => {
              const rankColors = [
                { bg: 'rgba(255, 215, 0, 0.15)', color: '#FFD700' }, // Gold
                { bg: 'rgba(192, 192, 192, 0.15)', color: '#C0C0C0' }, // Silver
                { bg: 'rgba(205, 127, 50, 0.15)', color: '#CD7F32' }  // Bronze
              ];
              const rColor = rankColors[index] || { bg: 'rgba(255,255,255,0.1)', color: 'var(--secondary-white)' };

              return (
                <div key={item.name} className="flex items-center justify-between" style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="flex items-center gap-3">
                    <span style={{ 
                      color: rColor.color, 
                      backgroundColor: rColor.bg,
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>#{index + 1}</span>
                    <span style={{ color: 'var(--primary-white)', fontSize: '0.95rem', fontWeight: 600 }}>
                      {item.name}
                    </span>
                  </div>
                  <span style={{ color: 'var(--primary-white)', fontSize: '0.9rem', fontWeight: 700 }}>
                    ${item.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
              );
            })}
            {chartData.length === 0 && <span className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--secondary-white)' }}>No expenses this month</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
