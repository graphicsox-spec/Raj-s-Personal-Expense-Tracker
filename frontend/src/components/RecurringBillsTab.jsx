import React, { useState, useEffect, useRef } from 'react';
import { fetchData, addData, deleteData, editData } from '../services/api';
import InfoTooltip from './InfoTooltip';
import CustomSelect from './CustomSelect';
import { RefreshCw, Trash2, Edit2, Plus, X, Check, HelpCircle } from 'lucide-react';

const RecurringBillsTab = () => {
  const sheetName = 'Recurring Bills';
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);
  
  // Form State
  const [billName, setBillName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [autoPay, setAutoPay] = useState('No');
  const [account, setAccount] = useState('');

  const loadBills = async () => {
    setLoading(true);
    try {
      const data = await fetchData(sheetName);
      setBills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const handleSave = async () => {
    if (!billName || !amount || !dueDate) return alert('Please fill in required fields');
    
    setLoading(true);
    const dataObj = {
      Bill: billName,
      'Due Date': dueDate,
      Amount: parseFloat(amount),
      'Auto Pay': autoPay,
      'Account Used': account
    };

    try {
      if (editingId) {
        await editData(sheetName, { ID: editingId, ...dataObj });
      } else {
        await addData(sheetName, dataObj);
      }
      cancelEdit();
      await loadBills();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this recurring bill?')) {
      setLoading(true);
      try {
        await deleteData(sheetName, id);
        await loadBills();
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  const startEdit = (b) => {
    setEditingId(b.ID || b.id);
    setBillName(b.Bill || '');
    setDueDate(b['Due Date'] || '');
    setAmount(b.Amount || '');
    setAutoPay(b['Auto Pay'] || 'No');
    setAccount(b['Account Used'] || '');
    setIsAdding(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setBillName('');
    setDueDate('');
    setAmount('');
    setAutoPay('No');
    setAccount('');
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2>Recurring Bills</h2>
          <InfoTooltip 
            title="Fixed Monthly Bills"
            description="Track utility bills, internet, and subscriptions. Logging them here ensures you always know what's due and whether it's set to Auto Pay."
            example="Electricity Bill, Due on 15th, $120."
          />
        </div>
        <div className="flex gap-2">
          <button className="secondary" onClick={loadBills} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          {!isAdding && (
            <button onClick={() => {
              setIsAdding(true);
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}>
              <Plus size={16} /> Add Bill
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="glass-panel mb-4" ref={formRef}>
          <h3 className="mb-4">{editingId ? 'Edit Bill' : 'New Bill'}</h3>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group mb-0">
              <label>Bill Name</label>
              <input type="text" value={billName} onChange={e => setBillName(e.target.value)} placeholder="e.g. Electricity" />
            </div>
            <div className="form-group mb-0">
              <label>Due Date (Day of Month)</label>
              <input type="text" value={dueDate} onChange={e => setDueDate(e.target.value)} placeholder="e.g. 15th" />
            </div>
            <div className="form-group mb-0">
              <label>Amount ($)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div className="form-group mb-0">
              <label>Auto Pay</label>
              <CustomSelect 
                name="autoPay"
                value={autoPay} 
                onChange={e => setAutoPay(e.target.value)}
                options={['Yes', 'No']}
                icon={HelpCircle}
              />
            </div>
            <div className="form-group mb-0">
              <label>Account Used</label>
              <input type="text" value={account} onChange={e => setAccount(e.target.value)} placeholder="e.g. Chase Checking" />
            </div>
          </div>
          <div className="flex justify-end gap-2" style={{ height: '44px' }}>
            <button className="secondary" style={{ height: '100%', padding: '0 24px', display: 'flex', alignItems: 'center' }} onClick={cancelEdit}><X size={16} /> Cancel</button>
            <button style={{ height: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleSave} disabled={loading}><Check size={16} /> Save</button>
          </div>
        </div>
      )}

      {loading && bills.length === 0 ? (
        <div className="empty-state">Loading...</div>
      ) : bills.length === 0 ? (
        <div className="empty-state">No recurring bills set. Add one!</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Bill</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Auto Pay</th>
                <th>Account</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((b, i) => (
                <tr key={b.ID || i}>
                  <td data-label="Bill">{b.Bill}</td>
                  <td data-label="Due Date">{b['Due Date']}</td>
                  <td data-label="Amount" className="text-blue font-semibold">${parseFloat(b.Amount || 0).toFixed(2)}</td>
                  <td data-label="Auto Pay">
                    <span className={`status-badge ${b['Auto Pay'] === 'Yes' ? 'status-paid' : 'status-pending'}`}>
                      {b['Auto Pay']}
                    </span>
                  </td>
                  <td data-label="Account">{b['Account Used']}</td>
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

export default RecurringBillsTab;
