import React, { useState, useEffect, useRef } from 'react';
import { fetchData, addData, deleteData, editData } from '../services/api';
import InfoTooltip from './InfoTooltip';
import CustomDatePicker from './CustomDatePicker';
import CustomSelect from './CustomSelect';
import { RefreshCw, Trash2, Edit2, Plus, X, Check, HelpCircle } from 'lucide-react';

const ProjectExpensesTab = ({ title, sheetName }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [vendor, setVendor] = useState('');
  const [project, setProject] = useState('');
  const [cost, setCost] = useState('');
  const [paid, setPaid] = useState('Yes');
  const [notes, setNotes] = useState('');

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchData(sheetName);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [sheetName]);

  const handleSave = async () => {
    if (!date || !vendor || !cost) return alert('Please fill in Date, Vendor, and Cost');
    
    setLoading(true);
    const dataObj = {
      Date: date,
      Vendor: vendor,
      Project: project,
      Cost: parseFloat(cost),
      'Paid?': paid,
      Notes: notes
    };

    try {
      if (editingId) {
        await editData(sheetName, { ID: editingId, ...dataObj });
      } else {
        await addData(sheetName, dataObj);
      }
      cancelEdit();
      await loadItems();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this record?')) {
      setLoading(true);
      try {
        await deleteData(sheetName, id);
        await loadItems();
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  const startEdit = (b) => {
    setEditingId(b.ID || b.id);
    let rawDate = b.Date || '';
    if (rawDate && rawDate.includes('T')) rawDate = rawDate.split('T')[0];
    setDate(rawDate);
    setVendor(b.Vendor || '');
    setProject(b.Project || '');
    setCost(b.Cost || '');
    setPaid(b['Paid?'] || 'Yes');
    setNotes(b.Notes || '');
    setIsAdding(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setDate(new Date().toISOString().split('T')[0]);
    setVendor('');
    setProject('');
    setCost('');
    setPaid('Yes');
    setNotes('');
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2>{title}</h2>
          <InfoTooltip 
            title={title}
            description="Log specific project costs or rare expenses here. These are separated from your daily expenses so they don't artificially inflate your monthly spending trend."
            example="Home Depot: $400 for Kitchen remodel."
          />
        </div>
        <div className="flex gap-2">
          <button className="secondary" onClick={loadItems} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          {!isAdding && (
            <button onClick={() => {
              setIsAdding(true);
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}>
              <Plus size={16} /> Add Expense
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="glass-panel mb-4" ref={formRef}>
          <h3 className="mb-4">{editingId ? 'Edit Entry' : 'New Entry'}</h3>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group mb-0">
              <label>Date</label>
              <CustomDatePicker 
                name="date"
                value={date} 
                onChange={e => setDate(e.target.value)} 
              />
            </div>
            <div className="form-group mb-0">
              <label>Vendor</label>
              <input type="text" value={vendor} onChange={e => setVendor(e.target.value)} placeholder="Home Depot, Contractor..." />
            </div>
            <div className="form-group mb-0">
              <label>Project / Category</label>
              <input type="text" value={project} onChange={e => setProject(e.target.value)} placeholder="Kitchen remodel, Taxes..." />
            </div>
            <div className="form-group mb-0">
              <label>Cost ($)</label>
              <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="0.00" />
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
            <div className="form-group mb-0" style={{ gridColumn: '1 / -1' }}>
              <label>Notes</label>
              <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional details..." />
            </div>
          </div>
          <div className="flex justify-end gap-2" style={{ height: '44px', marginTop: '1rem' }}>
            <button className="secondary" style={{ height: '100%', padding: '0 24px', display: 'flex', alignItems: 'center' }} onClick={cancelEdit}><X size={16} /> Cancel</button>
            <button style={{ height: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleSave} disabled={loading}><Check size={16} /> Save</button>
          </div>
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="empty-state">Loading...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">No records found. Add one!</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vendor</th>
                <th>Project</th>
                <th>Cost</th>
                <th>Paid?</th>
                <th>Notes</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b, i) => {
                let displayDate = b.Date;
                if (displayDate && displayDate.includes('T')) {
                  displayDate = new Date(displayDate).toLocaleDateString();
                }
                return (
                  <tr key={b.ID || i}>
                    <td data-label="Date">{displayDate}</td>
                    <td data-label="Vendor">{b.Vendor}</td>
                    <td data-label="Project">{b.Project}</td>
                    <td data-label="Cost" className="text-blue font-semibold">${parseFloat(b.Cost || 0).toFixed(2)}</td>
                    <td data-label="Paid?">
                      <span className={`status-badge ${b['Paid?'] === 'Yes' ? 'status-paid' : 'status-pending'}`}>
                        {b['Paid?']}
                      </span>
                    </td>
                    <td data-label="Notes">{b.Notes}</td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectExpensesTab;
