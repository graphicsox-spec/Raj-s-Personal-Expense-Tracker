import React, { useState, useEffect, useRef } from 'react';
import { fetchData, addData, deleteData, editData } from '../services/api';
import InfoTooltip from './InfoTooltip';
import CustomSelect from './CustomSelect';
import { RefreshCw, Trash2, Edit2, Plus, X, Check, CreditCard, HelpCircle } from 'lucide-react';
import { SUBCATEGORIES } from '../constants';

const CreditCardsTab = () => {
  const sheetName = 'Credit Cards';
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);
  
  // Form State
  const [cardName, setCardName] = useState(SUBCATEGORIES['Credit Cards'][0]);
  const [balance, setBalance] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [minDue, setMinDue] = useState('');
  const [paid, setPaid] = useState('No');

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await fetchData(sheetName);
      setCards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleSave = async () => {
    if (!balance || !dueDate) return alert('Please fill in required fields');
    
    setLoading(true);
    const dataObj = {
      Card: cardName,
      'Current Balance': parseFloat(balance),
      'Due Date': dueDate,
      'Minimum Due': minDue ? parseFloat(minDue) : 0,
      'Paid?': paid
    };

    try {
      if (editingId) {
        await editData(sheetName, { ID: editingId, ...dataObj });
      } else {
        await addData(sheetName, dataObj);
      }
      cancelEdit();
      await loadCards();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this credit card record?')) {
      setLoading(true);
      try {
        await deleteData(sheetName, id);
        await loadCards();
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  const startEdit = (b) => {
    setEditingId(b.ID || b.id);
    setCardName(b.Card || SUBCATEGORIES['Credit Cards'][0]);
    setBalance(b['Current Balance'] || '');
    setDueDate(b['Due Date'] || '');
    setMinDue(b['Minimum Due'] || '');
    setPaid(b['Paid?'] || 'No');
    setIsAdding(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setCardName(SUBCATEGORIES['Credit Cards'][0]);
    setBalance('');
    setDueDate('');
    setMinDue('');
    setPaid('No');
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2>Credit Cards Tracker</h2>
          <InfoTooltip 
            title="Manage Credit Card Debt"
            description="Keep an eye on your outstanding balances, minimum dues, and payment deadlines. The total balance of all unpaid cards will show up on your Dashboard."
            example="Chase Sapphire: $1200 balance, $35 min due by the 20th."
          />
        </div>
        <div className="flex gap-2">
          <button className="secondary" onClick={loadCards} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          {!isAdding && (
            <button onClick={() => {
              setIsAdding(true);
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}>
              <Plus size={16} /> Add Card
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="glass-panel mb-4" ref={formRef}>
          <h3 className="mb-4">{editingId ? 'Edit Card' : 'New Card Details'}</h3>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group mb-0">
              <label>Card</label>
              <CustomSelect 
                name="cardName"
                value={cardName} 
                onChange={e => setCardName(e.target.value)}
                options={SUBCATEGORIES['Credit Cards']}
                icon={CreditCard}
              />
            </div>
            <div className="form-group mb-0">
              <label>Current Balance ($)</label>
              <input type="number" value={balance} onChange={e => setBalance(e.target.value)} placeholder="0.00" />
            </div>
            <div className="form-group mb-0">
              <label>Due Date (Day of Month)</label>
              <input type="text" value={dueDate} onChange={e => setDueDate(e.target.value)} placeholder="e.g. 20th" />
            </div>
            <div className="form-group mb-0">
              <label>Minimum Due ($)</label>
              <input type="number" value={minDue} onChange={e => setMinDue(e.target.value)} placeholder="0.00" />
            </div>
            <div className="form-group mb-0">
              <label>Paid?</label>
              <CustomSelect 
                name="paid"
                value={paid} 
                onChange={e => setPaid(e.target.value)}
                options={['Yes', 'No']}
                icon={HelpCircle}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2" style={{ height: '44px' }}>
            <button className="secondary" style={{ height: '100%', padding: '0 24px', display: 'flex', alignItems: 'center' }} onClick={cancelEdit}><X size={16} /> Cancel</button>
            <button style={{ height: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleSave} disabled={loading}><Check size={16} /> Save</button>
          </div>
        </div>
      )}

      {loading && cards.length === 0 ? (
        <div className="empty-state">Loading...</div>
      ) : cards.length === 0 ? (
        <div className="empty-state">No credit cards tracked. Add one!</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Card</th>
                <th>Current Balance</th>
                <th>Due Date</th>
                <th>Minimum Due</th>
                <th>Paid?</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((b, i) => (
                <tr key={b.ID || i}>
                  <td data-label="Card">
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-secondary-white" />
                      {b.Card}
                    </div>
                  </td>
                  <td data-label="Current Balance" className="text-red font-semibold">${parseFloat(b['Current Balance'] || 0).toFixed(2)}</td>
                  <td data-label="Due Date">{b['Due Date']}</td>
                  <td data-label="Minimum Due">${parseFloat(b['Minimum Due'] || 0).toFixed(2)}</td>
                  <td data-label="Paid?">
                    <span className={`status-badge ${b['Paid?'] === 'Yes' ? 'status-paid' : 'status-pending'}`}>
                      {b['Paid?']}
                    </span>
                  </td>
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

export default CreditCardsTab;
