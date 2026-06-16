import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import InfoTooltip from './InfoTooltip';
import { RefreshCw, DollarSign, Edit3, Check } from 'lucide-react';

const DashboardTab = ({ expenses }) => {
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [income, setIncome] = useState(parseFloat(localStorage.getItem('raj_monthly_income') || '0'));
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(income.toString());

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [budgetData, ccData] = await Promise.all([
        fetchData('Budget'),
        fetchData('Credit Cards')
      ]);
      setBudget(budgetData);
      setCreditCards(ccData);
    } catch (err) {
      console.error("Failed to load dashboard dependencies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const saveIncome = () => {
    const val = parseFloat(tempIncome) || 0;
    setIncome(val);
    localStorage.setItem('raj_monthly_income', val.toString());
    setIsEditingIncome(false);
  };

  return (
    <div className="tab-content">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2>Dashboard</h2>
          <InfoTooltip 
            title="Dashboard Overview"
            description="Your financial command center. View your total monthly income, track how much you are saving, and keep an eye on your credit card debt."
            example="If Income is $5000 and Expenses are $2000, Savings will show $3000."
          />
        </div>
        <div className="flex gap-2 items-center">
          {isEditingIncome ? (
            <div className="flex items-center gap-2 bg-black p-2" style={{ borderRadius: '8px', border: '1px solid var(--glass-border)'}}>
              <span className="text-secondary-white">$</span>
              <input 
                type="number" 
                value={tempIncome} 
                onChange={(e) => setTempIncome(e.target.value)}
                style={{ padding: '4px 8px', width: '100px', margin: 0 }}
              />
              <button onClick={saveIncome} style={{ padding: '4px 8px' }}><Check size={14}/></button>
            </div>
          ) : (
            <button className="secondary flex items-center gap-2" onClick={() => setIsEditingIncome(true)}>
              <DollarSign size={14}/> Set Income: ${income.toLocaleString('en-US')}
            </button>
          )}
          <button className="secondary" onClick={loadDashboardData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <DashboardStats 
        expenses={expenses} 
        budget={budget} 
        creditCards={creditCards} 
        income={income} 
      />
      
      <DashboardCharts expenses={expenses} />
    </div>
  );
};

export default DashboardTab;
