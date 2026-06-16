import React, { useState, useEffect, useRef } from 'react';
import { fetchData, addData, deleteData, editData } from '../services/api';
import { CATEGORIES } from '../constants';
import InfoTooltip from './InfoTooltip';
import CustomSelect from './CustomSelect';
import { RefreshCw, Trash2, Edit2, Plus, X, Check, List } from 'lucide-react';

const BudgetTab = () => {
  const sheetName = 'Budget';
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);
  
  // Form State
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const data = await fetchData(sheetName);
      setBudgets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleSave = async () => {
    if (!amount || isNaN(amount)) return alert('Please enter a valid amount');
    
    setLoading(true);
    try {
      if (editingId) {
        await editData(sheetName, {
          ID: editingId,
          Category: category,
          'Monthly Budget': parseFloat(amount)
        });
      } else {
        await addData(sheetName, {
          Category: category,
          'Monthly Budget': parseFloat(amount)
        });
      }
      setIsAdding(false);
      setEditingId(null);
      setCategory(CATEGORIES[0]);
      setAmount('');
      await loadBudgets();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget?')) {
      setLoading(true);
      try {
        await deleteData(sheetName, id);
        await loadBudgets();
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  const startEdit = (b) => {
    setEditingId(b.ID || b.id);
    setCategory(b.Category);
    setAmount(b['Monthly Budget']);
    setIsAdding(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setCategory(CATEGORIES[0]);
    setAmount('');
  };

  // Find categories that don't have a budget yet
  const usedCategories = budgets.map(b => b.Category);
  const availableCategories = editingId ? CATEGORIES : CATEGORIES.filter(c => !usedCategories.includes(c));

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2>Monthly Budgets</h2>
          <InfoTooltip 
            title="Category Budgets"
            description="Set strict or loose limits for different spending categories. The total budget allocated here is compared against your real expenses on the Dashboard."
            example="Dining Out: $300 limit per month."
          />
        </div>
        <div className="flex gap-2">
          <button className="secondary" onClick={loadBudgets} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="danger-outline" onClick={async () => {
            setLoading(true);
            for(const c of CATEGORIES) {
              try { await addData('Budget', { Category: c, 'Monthly Budget': Math.floor(Math.random()*90+10)*10 }); } catch(e){}
            }
            await loadBudgets();
          }}>
            Seed Data
          </button>
          {!isAdding && availableCategories.length > 0 && (
            <button onClick={() => {
              setIsAdding(true);
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}>
              <Plus size={16} /> Add Budget
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="glass-panel mb-4" ref={formRef}>
          <h3 className="mb-4">{editingId ? 'Edit Budget' : 'New Budget'}</h3>
          <div className="flex gap-4">
            <div className="form-group mb-0" style={{ flex: 1 }}>
              <label>Category</label>
              <CustomSelect 
                name="category"
                value={category} 
                onChange={e => setCategory(e.target.value)}
                options={availableCategories}
                icon={List}
              />
            </div>
            <div className="form-group mb-0" style={{ flex: 1 }}>
              <label>Monthly Budget ($)</label>
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="0.00"
                style={{ height: '44px' }}
              />
            </div>
            <div className="form-group mb-0">
              <label>&nbsp;</label>
              <div className="flex gap-2" style={{ height: '44px' }}>
                <button className="secondary" style={{ height: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={cancelEdit}><X size={16} /> Cancel</button>
                <button style={{ height: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleSave} disabled={loading}><Check size={16} /> Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && budgets.length === 0 ? (
        <div className="empty-state">Loading...</div>
      ) : budgets.length === 0 ? (
        <div className="empty-state">No budgets set. Add one!</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Monthly Budget</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b, i) => (
                <tr key={b.ID || i}>
                  <td data-label="Category">{b.Category}</td>
                  <td data-label="Monthly Budget" className="text-blue font-semibold">${parseFloat(b['Monthly Budget']).toFixed(2)}</td>
                  <td data-label="Actions">
                    <div className="flex gap-2">
                      <button className="secondary" style={{ padding: '8px' }} onClick={() => startEdit(b)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="danger-outline" style={{ padding: '8px' }} onClick={() => handleDelete(b.ID || b.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BudgetTab;
