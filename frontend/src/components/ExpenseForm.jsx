import React, { useState, useEffect } from 'react';
import { Plus, Loader, Calendar, DollarSign, Tag, CreditCard, FileText, ChevronUp, ChevronDown, Wallet, PlusCircle, Bookmark } from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES, PAYMENT_MODES } from '../constants';
import CustomSelect from './CustomSelect';
import CustomDatePicker from './CustomDatePicker';
import { getCategoryIcon } from './CategoryIcon';

const InputWrapper = ({ icon: Icon, children }) => (
  <div style={{ position: 'relative' }}>
    <div style={{ position: 'absolute', left: '14px', top: '22px', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
      <Icon size={18} color="#ffffff" />
    </div>
    <div className="custom-input-container">
      {children}
    </div>
  </div>
);

const ExpenseForm = ({ onAddExpense }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Date: new Date().toISOString().split('T')[0],
    Amount: '',
    Category: CATEGORIES[0],
    Subcategory: SUBCATEGORIES[CATEGORIES[0]] ? SUBCATEGORIES[CATEGORIES[0]][0] : '',
    'Payment Mode': PAYMENT_MODES[0],
    Description: ''
  });

  // When category changes, update subcategory options
  useEffect(() => {
    const subs = SUBCATEGORIES[formData.Category];
    setFormData(prev => ({
      ...prev,
      Subcategory: subs ? subs[0] : ''
    }));
  }, [formData.Category]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Amount || !formData.Date) return;
    
    setLoading(true);
    try {
      await onAddExpense({
        ...formData,
        Amount: parseFloat(formData.Amount)
      });
      setFormData({
        ...formData,
        Amount: '',
        Description: ''
      });
    } catch (error) {
      console.error(error);
      alert("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const currentSubcategories = SUBCATEGORIES[formData.Category];

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div className="flex items-center gap-3 mb-6">
        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
          <Wallet size={22} className="text-blue" />
          <PlusCircle size={12} fill="#141414" className="text-blue" style={{ position: 'absolute', bottom: '6px', left: '6px' }} strokeWidth={3} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Add New Expense</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date</label>
          <CustomDatePicker 
            name="Date"
            value={formData.Date}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Amount ($)</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '22px', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              <DollarSign size={18} color="#ffffff" />
            </div>
            <input 
              type="number" 
              name="Amount" 
              placeholder="e.g. 50.00" 
              value={formData.Amount} 
              onChange={handleChange} 
              min="0"
              step="0.01"
              style={{ paddingLeft: '44px', paddingRight: '36px', height: '44px', backgroundColor: 'rgba(0,0,0,0.4)', fontSize: '1.1rem', fontWeight: 500, color: '#ffffff', width: '100%' }}
              required 
            />
            <div style={{ position: 'absolute', right: '14px', top: '0', bottom: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px' }}>
              <div 
                onClick={() => {
                  const current = parseFloat(formData.Amount) || 0;
                  handleChange({ target: { name: 'Amount', value: (current + 1).toFixed(2) } });
                }}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', opacity: 0.6, height: '14px' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
              >
                <ChevronUp size={18} />
              </div>
              <div 
                onClick={() => {
                  const current = parseFloat(formData.Amount) || 0;
                  if (current >= 1) {
                    handleChange({ target: { name: 'Amount', value: (current - 1).toFixed(2) } });
                  }
                }}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', opacity: 0.6, height: '14px' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
              >
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <CustomSelect 
            name="Category"
            value={formData.Category}
            options={CATEGORIES}
            onChange={handleChange}
            icon={Tag}
            getOptionIcon={(opt) => getCategoryIcon(opt, 16)}
          />
        </div>

        {currentSubcategories && (
          <div className="form-group">
            <label>Subcategory</label>
            <CustomSelect 
              name="Subcategory"
              value={formData.Subcategory || currentSubcategories[0]}
              options={currentSubcategories}
              onChange={handleChange}
              icon={Bookmark}
            />
          </div>
        )}
        
        <div className="form-group">
          <label>Payment Mode</label>
          <CustomSelect 
            name="Payment Mode"
            value={formData['Payment Mode']}
            options={PAYMENT_MODES}
            onChange={handleChange}
            icon={CreditCard}
          />
        </div>
        
        <div className="form-group mb-6">
          <label>Description</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '16px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              <FileText size={18} color="#ffffff" />
            </div>
            <textarea 
              name="Description" 
              rows="3" 
              placeholder="Brief details about the expense"
              value={formData.Description}
              onChange={handleChange}
              style={{ paddingLeft: '44px', paddingTop: '14px', backgroundColor: 'rgba(0,0,0,0.4)', resize: 'none', color: '#ffffff' }}
            ></textarea>
          </div>
        </div>
        
        <button type="submit" className="w-full" disabled={loading} style={{
          background: 'linear-gradient(135deg, #0056b3 0%, #0099ff 100%)',
          boxShadow: '0 8px 20px rgba(0, 86, 179, 0.3)',
          border: 'none',
          height: '52px',
          fontSize: '1.05rem',
          letterSpacing: '0.5px',
          marginTop: '0.5rem',
          textTransform: 'uppercase'
        }}>
          {loading ? <Loader size={20} className="animate-spin" /> : <Plus size={20} />}
          {loading ? 'Adding Expense...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;

