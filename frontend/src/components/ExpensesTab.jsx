import React, { useState, useEffect, useRef } from 'react';
import { fetchExpenses, addExpense, deleteExpense, editExpense } from '../services/api';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import CategoryBreakdown from './CategoryBreakdown';
import EditExpenseModal from './EditExpenseModal';
import InfoTooltip from './InfoTooltip';
import { RefreshCw } from 'lucide-react';

const ExpensesTab = ({ expenses, loading, onRefresh, onAdd, onDelete, onEdit }) => {
  const [editingExpense, setEditingExpense] = useState(null);
  const formRef = useRef(null);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      onDelete(id);
    }
  };

  const handleUpdate = async (expenseData) => {
    await onEdit(expenseData);
    setEditingExpense(null);
  };

  const startEditing = (expense) => {
    setEditingExpense(expense);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (loading && expenses.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: '50vh' }}>
        <RefreshCw size={32} className="animate-spin text-blue" />
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="flex items-center mb-4">
        <h2 style={{ margin: 0 }}>Daily Expenses</h2>
        <InfoTooltip 
          title="Daily Variable Expenses"
          description="Log your day-to-day spending here. This data directly impacts your Remaining Budget and Dashboard charts."
          example="Bought Groceries for $150 using Chase Sapphire."
        />
      </div>
      <div className="layout-grid" ref={formRef}>
        <div>
          <ExpenseForm onAddExpense={onAdd} />
        </div>
        <div>
          <ExpenseTable expenses={expenses} onDelete={handleDelete} onEdit={startEditing} />
          <CategoryBreakdown expenses={expenses} />
        </div>
      </div>

      {editingExpense && (
        <EditExpenseModal 
          expense={editingExpense} 
          onUpdateExpense={handleUpdate} 
          onClose={() => setEditingExpense(null)} 
        />
      )}
    </div>
  );
};

export default ExpensesTab;
