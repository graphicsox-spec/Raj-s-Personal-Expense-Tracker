const SHEETS = {
  EXPENSES: 'Expenses',
  BUDGET: 'Budget',
  RECURRING_BILLS: 'Recurring Bills',
  CREDIT_CARDS: 'Credit Cards',
  HOME_EXPENSES: 'Home Expenses',
  ANNUAL_EXPENSES: 'Annual Expenses'
};

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const sheetConfigs = [
    { name: SHEETS.EXPENSES, headers: ['ID', 'Date', 'Amount', 'Category', 'Subcategory', 'Payment Mode', 'Description', 'Timestamp'] },
    { name: SHEETS.BUDGET, headers: ['ID', 'Category', 'Monthly Budget'] },
    { name: SHEETS.RECURRING_BILLS, headers: ['ID', 'Bill', 'Due Date', 'Amount', 'Auto Pay', 'Account Used', 'Timestamp'] },
    { name: SHEETS.CREDIT_CARDS, headers: ['ID', 'Card', 'Current Balance', 'Due Date', 'Minimum Due', 'Paid?', 'Timestamp'] },
    { name: SHEETS.HOME_EXPENSES, headers: ['ID', 'Date', 'Vendor', 'Project', 'Cost', 'Paid?', 'Notes', 'Timestamp'] },
    { name: SHEETS.ANNUAL_EXPENSES, headers: ['ID', 'Date', 'Vendor', 'Project', 'Cost', 'Paid?', 'Notes', 'Timestamp'] }
  ];

  sheetConfigs.forEach(config => {
    let sheet = ss.getSheetByName(config.name);
    if (!sheet) {
      sheet = ss.insertSheet(config.name);
      sheet.appendRow(config.headers);
      sheet.getRange(1, 1, 1, config.headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    } else {
      // If expenses sheet already exists and is missing Subcategory, we might need manual migration by the user, 
      // but for fresh setups it works perfectly.
    }
  });
}

// Generic helper to get data
function _getData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  if (values.length <= 1) return [];
  
  const headers = values[0];
  const rows = values.slice(1);
  
  return rows.map(row => {
    let item = {};
    headers.forEach((header, index) => {
      item[header] = row[index];
    });
    return item;
  });
}

// Generic helper to add data
function _addData(sheetName, dataObj, headersOrder) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet not found: " + sheetName);
  
  const newId = Utilities.getUuid();
  dataObj['ID'] = newId;
  dataObj['Timestamp'] = new Date();
  
  const newRow = headersOrder.map(header => dataObj[header] !== undefined ? dataObj[header] : '');
  sheet.appendRow(newRow);
  return newId;
}

// Generic helper to delete data
function _deleteData(sheetName, idToDelete) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet not found: " + sheetName);
  
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === idToDelete) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

// Generic helper to edit data
function _editData(sheetName, dataObj, headersOrder) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet not found: " + sheetName);
  
  const values = sheet.getDataRange().getValues();
  const idToEdit = dataObj['ID'] || dataObj['id'];
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === idToEdit) {
      dataObj['ID'] = idToEdit;
      // Preserve old timestamp if exists
      dataObj['Timestamp'] = values[i][headersOrder.indexOf('Timestamp')] || new Date();
      
      const updatedRow = headersOrder.map(header => dataObj[header] !== undefined ? dataObj[header] : '');
      sheet.getRange(i + 1, 1, 1, headersOrder.length).setValues([updatedRow]);
      return true;
    }
  }
  return false;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const sheetName = data.sheetName || SHEETS.EXPENSES;
    
    // Map of sheet names to their exact headers order
    const headersMap = {
      [SHEETS.EXPENSES]: ['ID', 'Date', 'Amount', 'Category', 'Subcategory', 'Payment Mode', 'Description', 'Timestamp'],
      [SHEETS.BUDGET]: ['ID', 'Category', 'Monthly Budget'],
      [SHEETS.RECURRING_BILLS]: ['ID', 'Bill', 'Due Date', 'Amount', 'Auto Pay', 'Account Used', 'Timestamp'],
      [SHEETS.CREDIT_CARDS]: ['ID', 'Card', 'Current Balance', 'Due Date', 'Minimum Due', 'Paid?', 'Timestamp'],
      [SHEETS.HOME_EXPENSES]: ['ID', 'Date', 'Vendor', 'Project', 'Cost', 'Paid?', 'Notes', 'Timestamp'],
      [SHEETS.ANNUAL_EXPENSES]: ['ID', 'Date', 'Vendor', 'Project', 'Cost', 'Paid?', 'Notes', 'Timestamp']
    };

    if (!headersMap[sheetName]) {
      throw new Error("Invalid sheet name: " + sheetName);
    }

    if (action === 'add') {
      const newId = _addData(sheetName, data, headersMap[sheetName]);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', id: newId })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'delete') {
      const deleted = _deleteData(sheetName, data.id);
      if (deleted) return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(ContentService.MimeType.JSON);
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'ID not found' })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'edit') {
      const edited = _editData(sheetName, data, headersMap[sheetName]);
      if (edited) return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(ContentService.MimeType.JSON);
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'ID not found' })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    if (e.parameter && e.parameter.action === 'getData') {
      const sheetName = e.parameter.sheetName || SHEETS.EXPENSES;
      const data = _getData(sheetName);
      
      // Sort Expenses by Date descending
      if (sheetName === SHEETS.EXPENSES || sheetName === SHEETS.HOME_EXPENSES || sheetName === SHEETS.ANNUAL_EXPENSES) {
         data.sort((a, b) => new Date(b.Date) - new Date(a.Date));
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: data }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default getExpenses for backwards compatibility
    if (e.parameter && e.parameter.action === 'getExpenses') {
       const data = _getData(SHEETS.EXPENSES);
       data.sort((a, b) => new Date(b.Date) - new Date(a.Date));
       return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: data }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle("Raj's Expense Tracker")
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1');
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// -------------------------------------------------------------
// NATIVE GOOGLE SCRIPT RUN APIs
// -------------------------------------------------------------

function getDataAPI(sheetName) {
  try {
    const data = _getData(sheetName || SHEETS.EXPENSES);
    if (sheetName === SHEETS.EXPENSES || sheetName === SHEETS.HOME_EXPENSES || sheetName === SHEETS.ANNUAL_EXPENSES || !sheetName) {
         data.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    }
    return JSON.stringify({ status: 'success', data: data });
  } catch (err) {
    return JSON.stringify({ status: 'error', message: err.toString() });
  }
}

function getExpensesAPI() { return getDataAPI(SHEETS.EXPENSES); }

function addDataAPI(sheetName, data) {
  try {
    const headersMap = {
      [SHEETS.EXPENSES]: ['ID', 'Date', 'Amount', 'Category', 'Subcategory', 'Payment Mode', 'Description', 'Timestamp'],
      [SHEETS.BUDGET]: ['ID', 'Category', 'Monthly Budget'],
      [SHEETS.RECURRING_BILLS]: ['ID', 'Bill', 'Due Date', 'Amount', 'Auto Pay', 'Account Used', 'Timestamp'],
      [SHEETS.CREDIT_CARDS]: ['ID', 'Card', 'Current Balance', 'Due Date', 'Minimum Due', 'Paid?', 'Timestamp'],
      [SHEETS.HOME_EXPENSES]: ['ID', 'Date', 'Vendor', 'Project', 'Cost', 'Paid?', 'Notes', 'Timestamp'],
      [SHEETS.ANNUAL_EXPENSES]: ['ID', 'Date', 'Vendor', 'Project', 'Cost', 'Paid?', 'Notes', 'Timestamp']
    };
    const newId = _addData(sheetName, data, headersMap[sheetName]);
    return JSON.stringify({ status: 'success', id: newId });
  } catch (err) {
    return JSON.stringify({ status: 'error', message: err.toString() });
  }
}

function addExpenseAPI(data) {
  return addDataAPI(SHEETS.EXPENSES, {
      Date: data.date, Amount: data.amount, Category: data.category, Subcategory: data.subcategory, 
      'Payment Mode': data.paymentMode, Description: data.description
  });
}

function deleteDataAPI(sheetName, idToDelete) {
  try {
    const deleted = _deleteData(sheetName, idToDelete);
    if (deleted) return JSON.stringify({ status: 'success' });
    return JSON.stringify({ status: 'error', message: 'ID not found' });
  } catch (err) {
    return JSON.stringify({ status: 'error', message: err.toString() });
  }
}

function deleteExpenseAPI(id) { return deleteDataAPI(SHEETS.EXPENSES, id); }

function editDataAPI(sheetName, data) {
  try {
    const headersMap = {
      [SHEETS.EXPENSES]: ['ID', 'Date', 'Amount', 'Category', 'Subcategory', 'Payment Mode', 'Description', 'Timestamp'],
      [SHEETS.BUDGET]: ['ID', 'Category', 'Monthly Budget'],
      [SHEETS.RECURRING_BILLS]: ['ID', 'Bill', 'Due Date', 'Amount', 'Auto Pay', 'Account Used', 'Timestamp'],
      [SHEETS.CREDIT_CARDS]: ['ID', 'Card', 'Current Balance', 'Due Date', 'Minimum Due', 'Paid?', 'Timestamp'],
      [SHEETS.HOME_EXPENSES]: ['ID', 'Date', 'Vendor', 'Project', 'Cost', 'Paid?', 'Notes', 'Timestamp'],
      [SHEETS.ANNUAL_EXPENSES]: ['ID', 'Date', 'Vendor', 'Project', 'Cost', 'Paid?', 'Notes', 'Timestamp']
    };
    const edited = _editData(sheetName, data, headersMap[sheetName]);
    if (edited) return JSON.stringify({ status: 'success' });
    return JSON.stringify({ status: 'error', message: 'ID not found' });
  } catch (err) {
    return JSON.stringify({ status: 'error', message: err.toString() });
  }
}

function editExpenseAPI(data) {
  return editDataAPI(SHEETS.EXPENSES, {
      ID: data.id, Date: data.date, Amount: data.amount, Category: data.category, Subcategory: data.subcategory, 
      'Payment Mode': data.paymentMode, Description: data.description
  });
}
