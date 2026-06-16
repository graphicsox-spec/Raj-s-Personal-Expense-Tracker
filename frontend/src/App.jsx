import React, { useState, useEffect } from 'react';
import { fetchExpenses, addExpense, deleteExpense, editExpense } from './services/api';
import DashboardTab from './components/DashboardTab';
import ExpensesTab from './components/ExpensesTab';
import BudgetTab from './components/BudgetTab';
import RecurringBillsTab from './components/RecurringBillsTab';
import CreditCardsTab from './components/CreditCardsTab';
import ProjectExpensesTab from './components/ProjectExpensesTab';
import { ReceiptText, RefreshCw, LayoutDashboard, Receipt, PiggyBank, CalendarClock, CreditCard, Home, CalendarDays, Info, X, Menu } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // We fetch expenses here because Dashboard needs it.
  // Other tabs can fetch their own data or we can lift state here if needed later.
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to load expenses", error);
      // alert("Failed to load data. Please check your API URL.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async (expenseData) => {
    await addExpense(expenseData);
    await loadData();
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      await loadData();
    } catch (error) {
      alert("Failed to delete expense");
    }
  };

  const handleUpdateExpense = async (expenseData) => {
    await editExpense(expenseData);
    await loadData();
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'budget', label: 'Budget', icon: PiggyBank },
    { id: 'recurring', label: 'Recurring Bills', icon: CalendarClock },
    { id: 'creditcards', label: 'Credit Cards', icon: CreditCard },
    { id: 'home', label: 'Home Exp', icon: Home },
    { id: 'annual', label: 'Annual Exp', icon: CalendarDays }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab expenses={expenses} />;
      case 'expenses':
        return (
          <ExpensesTab 
            expenses={expenses} 
            loading={loading} 
            onRefresh={loadData} 
            onAdd={handleAddExpense}
            onDelete={handleDeleteExpense}
            onEdit={handleUpdateExpense}
          />
        );
      case 'budget':
        return <BudgetTab />;
      case 'recurring':
        return <RecurringBillsTab />;
      case 'creditcards':
        return <CreditCardsTab />;
      case 'home':
        return <ProjectExpensesTab title="Home Expenses" sheetName="Home Expenses" />;
      case 'annual':
        return <ProjectExpensesTab title="Annual Expenses" sheetName="Annual Expenses" />;
      default:
        return null;
    }
  };

  return (
    <div className="app-layout" style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--primary-black)' }}>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ width: '240px', height: '100%', borderRight: '1px solid var(--glass-border)', padding: '24px', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(20,20,20,0.95)', flexShrink: 0 }}>
        <div className="brand" style={{ marginBottom: '40px' }}>
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <img src="/Raj.jpg" alt="Raj" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-blue)' }} />
              <div className="flex" style={{ flexDirection: 'column' }}>
                <h1 style={{ fontSize: '1.25rem' }}>Raj Tulsiani</h1>
                <span style={{ textTransform: 'none', letterSpacing: '0.5px', marginTop: '2px', opacity: 0.8, fontSize: '0.8rem' }}>Personal Finance</span>
              </div>
            </div>
            <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`sidebar-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false); // Close sidebar on mobile after clicking
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
          <button
            className="sidebar-btn"
            style={{ padding: '12px 20px' }}
            onClick={() => setShowUserGuide(true)}
          >
            <Info size={18} />
            <span>User Guide</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content" style={{ flex: 1, height: '100%', padding: '32px 40px', overflowY: 'auto', maxWidth: 'calc(100vw - 240px)' }}>
        
        {/* Mobile Header */}
        <div className="mobile-header">
          <div className="flex items-center gap-3">
            <button className="secondary" style={{ padding: '8px' }} onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 style={{ fontSize: '1.25rem', margin: 0 }}>{tabs.find(t => t.id === activeTab)?.label}</h1>
          </div>
          <button className="secondary" onClick={loadData} disabled={loading} style={{ padding: '8px' }}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <header className="desktop-header" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <button className="secondary" onClick={loadData} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </header>

        <main className="tab-content-container">
          {renderTabContent()}
        </main>
      </div>

      {/* User Guide Modal */}
      {showUserGuide && (
        <div className="modal-overlay" onClick={() => setShowUserGuide(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Info size={20} className="text-blue" /> App User Guide</h2>
              <button className="modal-close-btn" onClick={() => setShowUserGuide(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body premium-scrollbar">
              <h3>Overview</h3>
              <p>Welcome to your Personal Finance Dashboard. This app helps you track your daily expenses, manage budgets, monitor credit card balances, and plan for future savings.</p>
              
              <h3>Dashboard</h3>
              <p>Your high-level financial summary. It displays your monthly income, total spend for the month, current savings, and credit card balances. It also highlights your top 3 spending categories.</p>
              <p><strong>Set Income Button:</strong> Use this button at the top right of the dashboard to enter your total monthly income. The app uses this to calculate and display your exact <strong>Savings</strong> in real-time.</p>

              <h3>Expenses</h3>
              <p>Log all your day-to-day transactions here. You can add new expenses, categorize them, and see a detailed list of where your money is going.</p>

              <h3>Budget</h3>
              <p>Set a target spending limit for each category (like Groceries, Dining Out, Utilities). The app will show you how much you've spent against your budget to help you stay on track.</p>
              <p><strong>Note on Adding Budgets:</strong> You can only have one budget per category. If the <strong>"Add Budget"</strong> button disappears, it means all available categories already have a budget set. Delete an existing budget to free up its category.</p>

              <h3>Recurring Bills</h3>
              <p>Manage your fixed monthly subscriptions and bills (e.g., Netflix, Internet, Phone). Keep track of their amounts and due dates.</p>

              <h3>Credit Cards</h3>
              <p>A dedicated space to track all your credit cards, including their current balances, total limits, and next statement due dates. Essential for avoiding late fees.</p>

              <h3>Home Expenses</h3>
              <p>Track major home improvement projects, maintenance, or large household purchases separate from your daily expenses.</p>

              <h3>Annual Expenses</h3>
              <p>Log yearly or irregular expenses like Car Insurance, Property Tax, or Memberships, so they don't catch you by surprise.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
