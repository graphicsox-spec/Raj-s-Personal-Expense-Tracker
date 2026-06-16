import requests
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
        response = requests.post(URL, json={"action": "add", "sheetName": "Budget", "Category": cat, "Monthly Budget": budget}, allow_redirects=True)
        print(response.text)
    except Exception as e:
        print(f"Error: {e}")
