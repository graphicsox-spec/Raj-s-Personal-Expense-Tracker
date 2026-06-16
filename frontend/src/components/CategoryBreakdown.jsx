import React from 'react';
import { CATEGORIES } from '../constants';

const COLORS = ['#0056b3', '#00e676', '#ff4b4b', '#ffab00', '#9c27b0', '#00bcd4'];

const CategoryBreakdown = ({ expenses }) => {
  const totalExpense = expenses.reduce((sum, exp) => sum + parseFloat(exp.Amount), 0);

  const categoryTotals = {};
  CATEGORIES.forEach(cat => { categoryTotals[cat] = 0; });
  
  expenses.forEach(exp => {
    if (categoryTotals[exp.Category] === undefined) {
      categoryTotals[exp.Category] = 0;
    }
    categoryTotals[exp.Category] += parseFloat(exp.Amount);
  });

  const chartData = Object.keys(categoryTotals).map(key => ({
    name: key,
    value: categoryTotals[key]
  })).sort((a, b) => b.value - a.value);

  if (chartData.length === 0) return null;

  return (
    <div className="glass-panel" style={{ marginTop: '24px' }}>
      <h3 className="mb-6 text-gray" style={{fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-white)'}}>Category Breakdown</h3>
      <div className="category-breakdown-list">
        {chartData.map((item, index) => {
          const percentage = totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : 0;
          const maxCategoryValue = chartData[0].value;
          const fillPercentage = maxCategoryValue > 0 ? ((item.value / maxCategoryValue) * 100) : 0;
          
          return (
            <div key={item.name} style={{ marginBottom: '1.25rem' }}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    style={{ 
                      width: '12px', height: '12px', borderRadius: '4px', 
                      backgroundColor: COLORS[index % COLORS.length],
                      boxShadow: `0 0 8px ${COLORS[index % COLORS.length]}40`
                    }} 
                  />
                  <span style={{ fontWeight: 500, color: 'var(--primary-white)', fontSize: '0.95rem' }}>{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span style={{ color: 'var(--secondary-white)', fontSize: '0.875rem' }}>{percentage}%</span>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--primary-white)' }}>${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div 
                style={{ 
                  width: '100%', height: '6px', 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  borderRadius: '4px', overflow: 'hidden' 
                }}
              >
                <div 
                  style={{ 
                    width: `${fillPercentage}%`, height: '100%', 
                    backgroundColor: COLORS[index % COLORS.length],
                    borderRadius: '4px',
                    transition: 'width 1s ease-out'
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
