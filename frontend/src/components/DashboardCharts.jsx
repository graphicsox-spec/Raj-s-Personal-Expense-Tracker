import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { CATEGORIES } from '../constants';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a832a8', '#e8253f', '#25e855', '#e88925', '#e8e125', '#25d8e8'];

const DashboardCharts = ({ expenses = [] }) => {
  // Process data for Category Pie Chart (Current Month only)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthExpensesList = expenses.filter(exp => {
    const d = new Date(exp.Date);
    if (isNaN(d.getTime())) return false;
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const categoryTotals = {};
  thisMonthExpensesList.forEach(exp => {
    if (!categoryTotals[exp.Category]) categoryTotals[exp.Category] = 0;
    categoryTotals[exp.Category] += parseFloat(exp.Amount || 0);
  });

  const pieData = Object.keys(categoryTotals)
    .map(key => ({ name: key, value: categoryTotals[key] }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  // Process data for Monthly Trend (Last 6 Months)
  const monthlyTotals = {};
  expenses.forEach(exp => {
    const d = new Date(exp.Date);
    if (isNaN(d.getTime())) return;
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = d.toLocaleString('default', { month: 'short' });
    
    if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = { name: monthLabel, sortKey: monthKey, Spend: 0 };
    }
    monthlyTotals[monthKey].Spend += parseFloat(exp.Amount || 0);
  });

  const trendData = Object.values(monthlyTotals)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .slice(-12); // Last 12 months

  return (
    <div className="layout-grid" style={{ marginTop: '24px' }}>
      
      {/* Category Pie Chart */}
      <div className="glass-panel">
        <h3 style={{ marginBottom: '16px' }}>This Month's Spending</h3>
        {pieData.length > 0 ? (
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={pieData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                <XAxis type="number" stroke="var(--secondary-white)" tick={{fill: 'var(--secondary-white)', fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                <YAxis dataKey="name" type="category" stroke="var(--secondary-white)" tick={{fill: 'var(--secondary-white)', fontSize: 12}} width={120} />
                <Tooltip 
                  formatter={(value) => `$${value.toFixed(2)}`}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'var(--tertiary-black)', borderColor: 'var(--glass-border)', borderRadius: '8px', color: 'var(--primary-white)' }}
                  itemStyle={{ color: 'var(--primary-white)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            No expenses recorded this month
          </div>
        )}
      </div>

      {/* Monthly Trend Bar Chart */}
      <div className="glass-panel">
        <h3 style={{ marginBottom: '16px' }}>12-Month Trend</h3>
        {trendData.length > 0 ? (
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--secondary-white)" tick={{fill: 'var(--secondary-white)'}} />
                <YAxis stroke="var(--secondary-white)" tick={{fill: 'var(--secondary-white)'}} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  formatter={(value) => `$${value.toFixed(2)}`}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'var(--tertiary-black)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                />
                <Bar dataKey="Spend" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Not enough data for trend analysis
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardCharts;
