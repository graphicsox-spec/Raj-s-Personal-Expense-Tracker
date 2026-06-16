# 100% Private Google Apps Script Deployment Guide

This guide explains how to host your ENTIRE Expense Tracker (both the UI and the Database) purely on your Google Account. **No Vercel, no third-party servers, your data never leaves Google.**

## Step 1: Create the Database (Google Sheet)
1. Go to Google Drive and create a new **Google Sheet**. Name it `Raj Expense Tracker Database`.

## Step 2: Add Backend Code
1. In your new Google Sheet, click **Extensions > Apps Script** from the top menu.
2. A new tab opens. Delete any default code inside it.
3. Open `Code.js` from the `backend` folder of this project on your computer. Copy all its contents and paste them into the Apps Script editor.
4. Click the **Save** (floppy disk) icon or press `Ctrl + S`.

## Step 3: Run Initial Setup
1. In the Apps Script editor, click the dropdown menu at the top center (it usually says `doGet`) and change it to `setup`.
2. Click the **Run** button.
3. **Important:** Google will ask for Permissions.
   - Click *Review Permissions*.
   - Choose your Google Account.
   - Click *Advanced* (at the bottom) and then *Go to Untitled project (unsafe)*.
   - Click *Allow*.
4. Your Google Sheet will now automatically have an `Expenses` tab with all required columns.

## Step 4: Add the Frontend UI to Google Apps Script
1. First, we need to build your frontend code into a single file on your computer. 
2. Open your terminal/command prompt, go into the `frontend` folder, and run:
   ```bash
   npm run build
   ```
3. This will create a `dist` folder inside `frontend`. Inside `dist`, you will find a file named `index.html`. Open this file and **copy all of its contents**.
4. Go back to your Google Apps Script editor in the browser.
5. On the left sidebar, click the **+** icon next to Files and select **HTML**.
6. Name the file exactly: `Index` (Capital 'I'). It will become `Index.html`.
7. Delete any default code in `Index.html` and **paste the contents you copied from your built index.html**.
8. Save the file (`Ctrl + S`).

## Step 5: Publish the App Live
1. In the top right corner of the Apps Script screen, click the **Deploy** button.
2. Select **New deployment**.
3. Click the gear (⚙️) icon on the left side of the popup and select **Web app**.
4. Set the Configuration exactly to:
   - **Description:** `Expense Tracker App v1`
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone` (or `Anyone within your organization` if it's a Workspace account and you want it strictly internal).
5. Click **Deploy**.
6. You will get a **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).

**Congratulations! 🎉**
Open this URL in any browser on your phone or laptop. The beautiful UI will load instantly. All data is processed and saved entirely within your Google account. You do not need any external server!
