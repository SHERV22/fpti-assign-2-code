# 📚 API Reference

Complete reference for all available functions in the AI Budgeting Assistant.

## 🔐 Authentication Functions (`src/firebase/auth.js`)

### `signUp(email, password, displayName)`
Creates a new user account.
```javascript
await signUp('user@example.com', 'password123', 'John Doe');
```

### `signIn(email, password)`
Signs in an existing user.
```javascript
await signIn('user@example.com', 'password123');
```

### `logOut()`
Signs out the current user.
```javascript
await logOut();
```

### `onAuthStateChange(callback)`
Subscribes to authentication state changes.
```javascript
const unsubscribe = onAuthStateChange((user) => {
  console.log('User:', user);
});
```

### `getUserProfile(userId)`
Gets user profile data from Firestore.
```javascript
const profile = await getUserProfile(userId);
```

### `updateUserProfile(userId, data)`
Updates user profile data.
```javascript
await updateUserProfile(userId, { monthlyIncome: 5000 });
```

---

## 💳 Transaction Functions (`src/firebase/firestore.js`)

### `addTransaction(userId, transactionData)`
Adds a new transaction.
```javascript
await addTransaction(userId, {
  description: 'Grocery shopping',
  amount: 150.50,
  category: 'Food & Groceries',
  date: new Date(),
  type: 'expense'
});
```

### `getTransactions(userId, startDate, endDate)`
Gets transactions for a date range.
```javascript
const transactions = await getTransactions(
  userId,
  new Date('2024-01-01'),
  new Date('2024-01-31')
);
```

### `getTransactionsByCategory(userId, category, startDate, endDate)`
Gets transactions for a specific category.
```javascript
const transactions = await getTransactionsByCategory(
  userId,
  'Food & Groceries',
  startDate,
  endDate
);
```

### `updateTransaction(userId, transactionId, updatedData)`
Updates an existing transaction.
```javascript
await updateTransaction(userId, transactionId, {
  amount: 200.00,
  description: 'Updated description'
});
```

### `deleteTransaction(userId, transactionId)`
Deletes a transaction.
```javascript
await deleteTransaction(userId, transactionId);
```

---

## 💰 Budget Functions (`src/firebase/firestore.js`)

### `getBudget(userId)`
Gets the current budget.
```javascript
const budget = await getBudget(userId);
```

### `createBudget(userId, budgetData)`
Creates a new budget.
```javascript
await createBudget(userId, {
  categories: {
    'Housing': 1200,
    'Food & Groceries': 500,
    'Transportation': 300
  }
});
```

### `updateBudget(userId, budgetData)`
Updates the existing budget.
```javascript
await updateBudget(userId, {
  categories: {
    'Housing': 1300,
    'Food & Groceries': 550
  }
});
```

---

## 🤖 AI Functions (`src/services/geminiService.js`)

### `analyzeSpendingPatterns(transactions, userProfile)`
Analyzes spending patterns using AI.
```javascript
const analysis = await analyzeSpendingPatterns(transactions, userProfile);
// Returns: { analysis, topCategories, concerns, recommendation }
```

### `generateBudgetRecommendations(transactions, userProfile, currentBudget)`
Generates personalized budget recommendations.
```javascript
const recommendations = await generateBudgetRecommendations(
  transactions,
  userProfile,
  currentBudget
);
// Returns: { categories, reasoning }
```

### `detectOverspending(transactions, budget, userProfile)`
Detects overspending in categories.
```javascript
const alerts = await detectOverspending(transactions, budget, userProfile);
// Returns: { alerts, overallStatus }
```

### `generateMonthlySummary(transactions, budget, userProfile)`
Generates a friendly monthly summary.
```javascript
const summary = await generateMonthlySummary(transactions, budget, userProfile);
// Returns: string (summary text)
```

### `suggestBudgetAdjustments(lifeChange, currentBudget, userProfile)`
Suggests budget adjustments for life changes.
```javascript
const adjustments = await suggestBudgetAdjustments(
  "Got a new job with 20% salary increase",
  currentBudget,
  userProfile
);
// Returns: { adjustments, summary }
```

---

## 🔔 Notification Functions (`src/firebase/messaging.js`)

### `requestNotificationPermission()`
Requests browser notification permission.
```javascript
const token = await requestNotificationPermission();
```

### `onMessageListener()`
Listens for foreground messages.
```javascript
const payload = await onMessageListener();
```

### `saveFCMToken(userId, token)`
Saves FCM token to user profile.
```javascript
await saveFCMToken(userId, fcmToken);
```

---

## 📊 Insights Functions (`src/firebase/firestore.js`)

### `saveInsight(userId, insightData)`
Saves an AI-generated insight.
```javascript
await saveInsight(userId, {
  type: 'weekly',
  summary: 'Your spending is on track...',
  recommendations: ['Save more', 'Reduce dining out']
});
```

### `getInsights(userId, limit)`
Gets recent insights.
```javascript
const insights = await getInsights(userId, 10);
```

---

## 🛠️ Utility Functions (`src/utils/helpers.js`)

### `formatCurrency(amount, currency)`
Formats amount as currency.
```javascript
const formatted = formatCurrency(1234.56, 'USD');
// Returns: "$1,234.56"
```

### `calculatePercentage(value, total)`
Calculates percentage.
```javascript
const percent = calculatePercentage(500, 1000);
// Returns: 50
```

### `getBudgetStatusColor(percentage)`
Gets color based on budget status.
```javascript
const color = getBudgetStatusColor(85);
// Returns: "#f39c12" (warning color)
```

### `getCategoryIcon(category)`
Gets emoji icon for category.
```javascript
const icon = getCategoryIcon('Food & Groceries');
// Returns: "🛒"
```

### `calculateCategoryTotal(transactions, category)`
Calculates total spending for a category.
```javascript
const total = calculateCategoryTotal(transactions, 'Food & Groceries');
```

### `groupTransactionsByCategory(transactions)`
Groups transactions by category.
```javascript
const grouped = groupTransactionsByCategory(transactions);
// Returns: { 'Housing': [...], 'Food': [...] }
```

### `getCurrentMonthRange()`
Gets start and end dates for current month.
```javascript
const { startOfMonth, endOfMonth } = getCurrentMonthRange();
```

### `getLastNDaysRange(days)`
Gets date range for last N days.
```javascript
const { startDate, endDate } = getLastNDaysRange(30);
```

### `validateTransaction(transaction)`
Validates transaction data.
```javascript
const { isValid, errors } = validateTransaction(transaction);
```

### `exportToCSV(transactions, filename)`
Exports transactions to CSV file.
```javascript
exportToCSV(transactions, 'my-transactions.csv');
```

---

## 🎨 Constants (`src/utils/constants.js`)

### Available Categories
```javascript
import { CATEGORIES } from './utils/constants';
// ['Housing', 'Food & Groceries', 'Transportation', ...]
```

### Transaction Types
```javascript
import { TRANSACTION_TYPES } from './utils/constants';
// { EXPENSE: 'expense', INCOME: 'income' }
```

### Alert Thresholds
```javascript
import { ALERT_THRESHOLDS } from './utils/constants';
// { WARNING: 80, CRITICAL: 100 }
```

### Chart Colors
```javascript
import { CHART_COLORS } from './utils/constants';
// Array of hex colors for charts
```

---

## 🧪 Sample Data Functions (`src/utils/sampleData.js`)

### `generateSampleTransactions(count)`
Generates sample transactions for testing.
```javascript
const transactions = generateSampleTransactions(20);
```

### `generateSampleBudget(monthlyIncome)`
Generates a sample budget.
```javascript
const budget = generateSampleBudget(5000);
```

### `generateSampleUserProfile()`
Generates a sample user profile.
```javascript
const profile = generateSampleUserProfile();
```

### `calculateSpendingStats(transactions)`
Calculates spending statistics.
```javascript
const stats = calculateSpendingStats(transactions);
// Returns: { totalSpent, totalIncome, categoryBreakdown, ... }
```

### `getSpendingTrend(transactions)`
Analyzes spending trend.
```javascript
const trend = getSpendingTrend(transactions);
// Returns: 'increasing' | 'decreasing' | 'stable'
```

---

## 🔥 Firebase Cloud Functions (`functions/index.js`)

### `dailyBudgetCheck`
Scheduled function that runs daily at 9 AM.
- Checks all users' budgets
- Sends overspending alerts
- Automated, no manual trigger needed

### `onTransactionAdded`
Firestore trigger when transaction is added.
- Monitors category spending
- Sends real-time alerts
- Automatic execution

### `weeklyInsightsGeneration`
Scheduled function that runs Monday at 8 AM.
- Generates AI insights
- Sends weekly summaries
- Automated, no manual trigger needed

---

## 📱 React Components

### `<Auth />`
Authentication page component.
```jsx
import Auth from './components/Auth';
<Auth />
```

### `<Dashboard />`
Main dashboard component.
```jsx
import Dashboard from './components/Dashboard';
<Dashboard />
```

### `<AddTransaction />`
Transaction input modal.
```jsx
<AddTransaction
  userId={userId}
  onClose={() => {}}
  onAdd={() => {}}
/>
```

### `<TransactionList />`
Displays transaction list.
```jsx
<TransactionList
  transactions={transactions}
  onUpdate={() => {}}
/>
```

### `<BudgetOverview />`
Shows budget progress.
```jsx
<BudgetOverview
  budget={budget}
  transactions={transactions}
  userProfile={userProfile}
/>
```

### `<AIInsights />`
Displays AI-generated insights.
```jsx
<AIInsights insights={insights} />
```

---

## 🎯 Context Hooks

### `useAuth()`
Access authentication state.
```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();
  return <div>{user?.email}</div>;
}
```

---

## 🔑 Environment Variables

### Required Frontend Variables
```env
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_GEMINI_API_KEY
REACT_APP_FIREBASE_VAPID_KEY
```

### Required Backend Variables
```env
GEMINI_API_KEY
```

---

## 📊 Data Structures

### Transaction Object
```javascript
{
  id: 'string',
  description: 'string',
  amount: 'number',
  category: 'string',
  date: 'Date',
  type: 'expense' | 'income',
  userId: 'string',
  createdAt: 'Timestamp'
}
```

### Budget Object
```javascript
{
  categories: {
    'Housing': number,
    'Food & Groceries': number,
    // ... other categories
  },
  createdAt: 'Timestamp',
  updatedAt: 'Timestamp'
}
```

### User Profile Object
```javascript
{
  email: 'string',
  displayName: 'string',
  monthlyIncome: 'number',
  currency: 'string',
  fcmToken: 'string' (optional),
  createdAt: 'string'
}
```

### AI Insight Object
```javascript
{
  analysis: 'string',
  topCategories: ['string'],
  concerns: ['string'],
  recommendation: 'string'
}
```

---

**For more information, see the full README.md**
