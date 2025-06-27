# Fundify – Personal Finance for Students

Fundify is a powerful, all-in-one personal finance management app built specifically for students. With intelligent transaction tracking, AI-powered budgeting, smart reminders, and seamless bank syncing, Fundify helps you take control of your money with zero guesswork.

Built by students, for students — because we were tired of not knowing where our sneaker money went.

---

## Features

### Transaction Management
- Add deposits and Withdrawals with full details (amount, date, source/store, payment method)
- Set recurring transactions
- Filter, sort, and search transactions (by keyword or AI)
- Edit, duplicate, and delete entries
- Export/Import transactions (.csv, .json, .txt)

### AI-Powered Input
- Quick add via natural language (e.g., “I spent $120 at Nike on shoes”)
- Voice input with microphone button
- Receipt scanner (OCR + Groq): upload a photo and auto-fill the transaction

### Graphs and Summaries
- Daily, weekly, and monthly spending graphs
- Pie charts by payment method
- Balance history visualization
- Email summaries: week, month, year, or full report

### FundAI (ChatGPT-Style Assistant)
- Ask questions about your finances
- Get instant summaries, analysis, and insights
- Navigate the app by asking
- Fully integrated into your financial data

### Smart Budgeting
- Create budgets by category and timeframe
- AI-generated budgets from uploaded documents
- Predictive over-budget alerts using trends
- Progress bars and category breakdowns
- AI-generated feedback and suggestions

### Reminders and Notifications
- Add, edit, and delete financial reminders
- Get notified of upcoming bills and budget limits
- System notifications and sorting by date or amount

### Additional Tools
- Command Bar (Ctrl/Cmd + K) for full keyboard control
- Chrome Extension for syncing real bank data
- Secure login with 2FA and privacy controls

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Flask (Python)
- Database: SQLite (local)
- APIs/Tools:
  - Groq (AI input, FundAI)
  - Tesseract.js (OCR receipt scanner)
  - Chart.js (Graphs)
  - Flask-Mail (Email reports)
  - Google Fonts (fonts, icons)
  - LocalStorage
  - Web Speech API
  - Dribble, OpenAI, ChatGPT, Notion (UI Inspiration)
  - html2canvas