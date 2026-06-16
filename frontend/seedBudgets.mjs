const URL = 'https://script.google.com/macros/s/AKfycbyleP0YT2oi-hYjF1vfEN-eDiQAxp5kVZQrWJB7EZZGnB2nllSNGlsvfsURGbk088t1/exec';

const CATEGORIES = [
  'Mortgage',
  'Utilities',
  'Groceries',
  'Dining Out',
  'Gas',
  'Car Payment',
  'Insurance',
  'Home Improvement',
  'Samara',
  'Medical',
  'Travel',
  'Shopping',
  'Subscriptions',
  'Entertainment',
  'Gym/Fitness',
  'Personal Care',
  'Miscellaneous',
  'Credit Cards'
];

async function seed() {
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const budget = Math.floor(Math.random() * 90) * 10 + 100; // 100 to 1000 in steps of 10
    console.log(`Adding ${cat} with $${budget}...`);
    try {
      const response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'add',
          sheetName: 'Budget',
          Category: cat,
          'Monthly Budget': budget
        })
      });
      const data = await response.json();
      console.log(`Added ${cat}:`, data);
    } catch (e) {
      console.error(`Failed ${cat}:`, e.message);
    }
  }
  console.log("All done!");
}

seed();
