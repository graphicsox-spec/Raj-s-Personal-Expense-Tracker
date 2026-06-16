import urllib.request
import json
import random

URL = 'https://script.google.com/macros/s/AKfycbyleP0YT2oi-hYjF1vfEN-eDiQAxp5kVZQrWJB7EZZGnB2nllSNGlsvfsURGbk088t1/exec'
CATEGORIES = [
  'Mortgage', 'Utilities', 'Groceries', 'Dining Out', 'Gas', 
  'Car Payment', 'Insurance', 'Home Improvement', 'Samara', 
  'Medical', 'Travel', 'Shopping', 'Subscriptions', 'Entertainment', 
  'Gym/Fitness', 'Personal Care', 'Miscellaneous', 'Credit Cards'
]

for cat in CATEGORIES:
    budget = random.randint(10, 100) * 10
    print(f"Adding {cat} with ${budget}...")
    try:
        data = json.dumps({"action": "add", "sheetName": "Budget", "Category": cat, "Monthly Budget": budget}).encode('utf-8')
        req = urllib.request.Request(URL, data=data, headers={'Content-Type': 'text/plain'})
        response = urllib.request.urlopen(req)
        print(response.read().decode('utf-8'))
    except Exception as e:
        print(f"Error: {e}")
