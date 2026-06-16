import React, { useState, useEffect } from 'react';
import { Loader, DollarSign, Tag, CreditCard, FileText, ChevronUp, ChevronDown, Save, X, Bookmark } from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES, PAYMENT_MODES } from '../constants';
import CustomSelect from './CustomSelect';
import CustomDatePicker from './CustomDatePicker';
import { getCategoryIcon } from './CategoryIcon';

const EditExpenseModal = ({ expense, onUpdateExpense, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ID: '',
    Date: '',
    Amount: '',
    Category: '',
    Subcategory: '',
    'Payment Mode': '',
    Description: ''
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        ID: expense.ID,
        Date: expense.Date,
        Amount: expense.Amount.toString(),
        Category: expense.Category,
        Subcategory: expense.Subcategory || '',
        'Payment Mode': expense['Payment Mode'],
        Description: expense.Description || ''
      });
    }
  }, [expense]);

  // When category changes, update subcategory options if the new category is different
  useEffect(() => {
    if (expense && formData.Category && formData.Category !== expense.Category) {
      const subs = SUBCATEGORIES[formData.Category];
      setFormData(prev => ({
        ...prev,
        Subcategory: subs ? subs[0] : ''
      }));
    }
  }, [formData.Category, expense]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Amount || !formData.Date) return;
    
    setLoading(true);
    try {
      await onUpdateExpense({
        ...formData,
        Amount: parseFloat(formData.Amount)
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  if (!expense) return null;

  const currentSubcategories = SUBCATEGORIES[formData.Category];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel premium-scrollbar" style={{ padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#a0a0a0', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px' }}>
            <Save size={24} className="text-blue" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Edit Expense</h3>
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
          
          <div className="flex gap-3">
            <button type="button" onClick={onClose} disabled={loading} style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              height: '52px',
              fontSize: '1.05rem',
              color: '#fff'
            }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              flex: 1,
              background: 'linear-gradient(135deg, #0056b3 0%, #0099ff 100%)',
              boxShadow: '0 8px 20px rgba(0, 86, 179, 0.3)',
              border: 'none',
              height: '52px',
              fontSize: '1.05rem',
              color: '#fff'
            }}>
              {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;

