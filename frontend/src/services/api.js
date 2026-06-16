// This is the API service.
// Replace this URL with the one generated from your Google Apps Script "Web App" deployment.
export const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyleP0YT2oi-hYjF1vfEN-eDiQAxp5kVZQrWJB7EZZGnB2nllSNGlsvfsURGbk088t1/exec';

const USE_MOCK = !GAS_API_URL;

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getMockDataKey = (sheetName) => `raj_tracker_${sheetName.replace(/\s+/g, '_')}`;

const initialMockData = {
  'Expenses': [
    { ID: '1', Date: new Date().toISOString().split('T')[0], Amount: 150.00, Category: 'Groceries', 'Payment Mode': 'Credit Card', Description: 'Costco run', Timestamp: new Date().toISOString() },
  ],
  'Budget': [
    { ID: '1', Category: 'Groceries', 'Monthly Budget': 800 },
    { ID: '2', Category: 'Dining Out', 'Monthly Budget': 400 },
  ],
  'Recurring Bills': [
    { ID: '1', Bill: 'Electricity', 'Due Date': '15', Amount: 120, 'Auto Pay': 'Yes', 'Account Used': 'Chase Checking', Timestamp: new Date().toISOString() }
  ],
  'Credit Cards': [
    { ID: '1', Card: 'Chase Sapphire', 'Current Balance': 1200, 'Due Date': '20', 'Minimum Due': 35, 'Paid?': 'No', Timestamp: new Date().toISOString() }
  ],
  'Home Expenses': [],
  'Annual Expenses': []
};

export const fetchData = async (sheetName = 'Expenses') => {
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(res => {
          const result = JSON.parse(res);
          if (result.status === 'success') resolve(result.data);
          else reject(new Error(result.message));
        })
        .withFailureHandler(err => reject(err))
        .getDataAPI(sheetName);
    });
  }

  if (USE_MOCK) {
    await delay(600);
    const mockKey = getMockDataKey(sheetName);
    const stored = localStorage.getItem(mockKey);
    if (!stored) {
      const initData = initialMockData[sheetName] || [];
      localStorage.setItem(mockKey, JSON.stringify(initData));
      return initData;
    }
    return JSON.parse(stored);
  }

  try {
    if (sheetName === 'Budget') {
      const cats = ['Mortgage','Utilities','Groceries','Dining Out','Gas','Car Payment','Insurance','Home Improvement','Samara','Medical','Travel','Shopping','Subscriptions','Entertainment','Gym/Fitness','Personal Care','Miscellaneous','Credit Cards'];
      return cats.map((c, i) => ({ ID: 'mock_'+i, Category: c, 'Monthly Budget': Math.floor(Math.random()*90+10)*10 }));
    }
    if (sheetName === 'Expenses') {
      const cats = ['Groceries', 'Dining Out', 'Gas', 'Shopping', 'Entertainment', 'Medical', 'Personal Care', 'Car Payment', 'Insurance', 'Utilities', 'Samara'];
      const subCatMap = {
        'Car Payment': ['Raj', 'Sharan'],
        'Insurance': ['Raj Car Insurance', 'Sharan Car Insurance', 'Homeowners Insurance'],
        'Utilities': ['Electricity', 'Water', 'Internet', 'Cell Phone', 'Trash'],
        'Samara': ['School', 'Clothes', 'Activities', 'Toys', 'Medical']
      };
      const data = [];
      for(let m=2; m<=6; m++) {
        for(let i=0; i<15; i++) {
          const cat = cats[Math.floor(Math.random()*cats.length)];
          const subCat = subCatMap[cat] ? subCatMap[cat][Math.floor(Math.random()*subCatMap[cat].length)] : '';
          data.push({ 
            ID: `mock_e_${m}_${i}`, 
            Date: `2026-0${m}-${String(Math.floor(Math.random()*28)+1).padStart(2,'0')}`, 
            Amount: Math.floor(Math.random()*150)+15, 
            Category: cat, 
            Subcategory: subCat,
            'Payment Mode': 'Credit Card', 
            Description: 'Sample Expense '+i 
          });
        }
      }
      return data;
    }
    if (sheetName === 'Recurring Bills') {
      return [
        { ID: 'm1', Bill: 'Electricity', 'Due Date': '15', Amount: 120, 'Auto Pay': 'Yes', 'Account Used': 'Chase Checking' },
        { ID: 'm2', Bill: 'Internet', 'Due Date': '05', Amount: 80, 'Auto Pay': 'Yes', 'Account Used': 'Credit Card' },
        { ID: 'm3', Bill: 'Water', 'Due Date': '22', Amount: 45, 'Auto Pay': 'No', 'Account Used': 'Checking' },
        { ID: 'm4', Bill: 'Gym Membership', 'Due Date': '01', Amount: 60, 'Auto Pay': 'Yes', 'Account Used': 'Credit Card' }
      ];
    }
    if (sheetName === 'Credit Cards') {
      return [
        { ID: 'm1', Card: 'Chase Sapphire', 'Current Balance': 1250.00, 'Due Date': '20', 'Minimum Due': 35, 'Paid?': 'No' },
        { ID: 'm2', Card: 'Amex Gold', 'Current Balance': 450.00, 'Due Date': '12', 'Minimum Due': 40, 'Paid?': 'Yes' },
        { ID: 'm3', Card: 'Discover', 'Current Balance': 890.00, 'Due Date': '25', 'Minimum Due': 25, 'Paid?': 'No' }
      ];
    }
    if (sheetName === 'Home Expenses') {
      return [
        { ID: 'm1', Date: '2026-06-10', Vendor: 'Home Depot', Project: 'Garden Renovation', Cost: 350.00, 'Paid?': 'Yes', Notes: 'Plants and soil' },
        { ID: 'm2', Date: '2026-05-22', Vendor: 'Lowe\'s', Project: 'Plumbing', Cost: 150.00, 'Paid?': 'Yes', Notes: 'Fixed sink' }
      ];
    }
    if (sheetName === 'Annual Expenses') {
      return [
        { ID: 'm1', Date: '2026-01-15', Vendor: 'Geico', Project: 'Car Insurance', Cost: 1200.00, 'Paid?': 'Yes', Notes: '6 months premium' },
        { ID: 'm2', Date: '2026-04-01', Vendor: 'HOA', Project: 'Annual Fees', Cost: 600.00, 'Paid?': 'No', Notes: 'Annual maintenance' }
      ];
    }
    const url = GAS_API_URL.includes('?') ? `${GAS_API_URL}&action=getData&sheetName=${encodeURIComponent(sheetName)}` : `${GAS_API_URL}?action=getData&sheetName=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    const result = await response.json();
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error(`Error fetching data for ${sheetName}:`, error);
    throw error;
  }
};

export const addData = async (sheetName, data) => {
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(res => {
          const result = JSON.parse(res);
          if (result.status === 'success') resolve({ status: 'success', id: result.id });
          else reject(new Error(result.message));
        })
        .withFailureHandler(err => reject(err))
        .addDataAPI(sheetName, data);
    });
  }

  if (USE_MOCK) {
    await delay(800);
    const mockKey = getMockDataKey(sheetName);
    const stored = JSON.parse(localStorage.getItem(mockKey) || '[]');
    const newData = {
      ID: Math.random().toString(36).substring(2, 9),
      Timestamp: new Date().toISOString(),
      ...data
    };
    const updated = [newData, ...stored];
    localStorage.setItem(mockKey, JSON.stringify(updated));
    return { status: 'success', id: newData.ID };
  }

  try {
    const response = await fetch(GAS_API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'add', sheetName, ...data })
    });
    const result = await response.json();
    if (result.status === 'success') {
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error(`Error adding data to ${sheetName}:`, error);
    throw error;
  }
};

export const deleteData = async (sheetName, id) => {
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(res => {
          const result = JSON.parse(res);
          if (result.status === 'success') resolve({ status: 'success' });
          else reject(new Error(result.message));
        })
        .withFailureHandler(err => reject(err))
        .deleteDataAPI(sheetName, id);
    });
  }

  if (USE_MOCK) {
    await delay(500);
    const mockKey = getMockDataKey(sheetName);
    const stored = JSON.parse(localStorage.getItem(mockKey) || '[]');
    const updated = stored.filter(e => e.ID !== id);
    localStorage.setItem(mockKey, JSON.stringify(updated));
    return { status: 'success' };
  }

  try {
    const response = await fetch(GAS_API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', sheetName, id })
    });
    const result = await response.json();
    if (result.status === 'success') {
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error(`Error deleting data from ${sheetName}:`, error);
    throw error;
  }
};

export const editData = async (sheetName, data) => {
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(res => {
          const result = JSON.parse(res);
          if (result.status === 'success') resolve({ status: 'success' });
          else reject(new Error(result.message));
        })
        .withFailureHandler(err => reject(err))
        .editDataAPI(sheetName, data);
    });
  }

  if (USE_MOCK) {
    await delay(800);
    const mockKey = getMockDataKey(sheetName);
    const stored = JSON.parse(localStorage.getItem(mockKey) || '[]');
    const updated = stored.map(e => e.ID === (data.ID || data.id) ? { ...e, ...data } : e);
    localStorage.setItem(mockKey, JSON.stringify(updated));
    return { status: 'success' };
  }

  try {
    const response = await fetch(GAS_API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'edit', sheetName, ...data })
    });
    const result = await response.json();
    if (result.status === 'success') {
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error(`Error editing data in ${sheetName}:`, error);
    throw error;
  }
};

// Aliases for backwards compatibility with existing components
export const fetchExpenses = () => fetchData('Expenses');
export const addExpense = (data) => addData('Expenses', {
    Date: data.Date || data.date, 
    Amount: data.Amount || data.amount, 
    Category: data.Category || data.category, 
    Subcategory: data.Subcategory || data.subcategory,
    'Payment Mode': data['Payment Mode'] || data.paymentMode || data.PaymentMode, 
    Description: data.Description || data.description
});
export const deleteExpense = (id) => deleteData('Expenses', id);
export const editExpense = (data) => editData('Expenses', {
    ID: data.ID || data.id,
    Date: data.Date || data.date, 
    Amount: data.Amount || data.amount, 
    Category: data.Category || data.category, 
    Subcategory: data.Subcategory || data.subcategory,
    'Payment Mode': data['Payment Mode'] || data.paymentMode || data.PaymentMode, 
    Description: data.Description || data.description
});
