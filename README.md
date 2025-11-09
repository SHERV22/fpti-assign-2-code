# 💰 AI-Powered Budgeting Assistant

An intelligent budgeting application that uses **Firebase** for backend services and **Google's Gemini API** for AI-powered financial insights and recommendations.

## 🌟 Features

- **🔐 User Authentication** - Secure Firebase Authentication
- **💳 Expense Tracking** - Add, view, and manage transactions
- **📊 Budget Management** - Set category-based budget limits
- **🤖 AI-Powered Insights** - Gemini API analyzes spending patterns
- **⚠️ Smart Alerts** - Proactive notifications for overspending
- **📈 Visual Analytics** - Interactive charts and progress tracking
- **🔄 Adaptive Budgeting** - AI adjusts recommendations based on behavior
- **📱 Real-time Notifications** - Firebase Cloud Messaging alerts

## 🛠️ Tech Stack

- **Frontend:** React 18
- **Backend:** Firebase (Authentication, Firestore, Cloud Functions, Cloud Messaging)
- **AI:** Google Gemini API (Generative AI)
- **Charts:** Recharts
- **Routing:** React Router v6
- **Date Handling:** date-fns
- **Icons:** Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase CLI** (`npm install -g firebase-tools`)
- A **Firebase Project** (create one at [Firebase Console](https://console.firebase.google.com/))
- A **Gemini API Key** (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd "d:\fpti assign 2 code"
```

### 2. Install Dependencies

#### Install Frontend Dependencies
```bash
npm install
```

#### Install Firebase Functions Dependencies
```bash
cd functions
npm install
cd ..
```

### 3. Firebase Setup

#### Login to Firebase
```bash
firebase login
```

#### Initialize Firebase (if not already done)
```bash
firebase init
```

Select the following features:
- ✅ Firestore
- ✅ Functions
- ✅ Hosting

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Email/Password** authentication
4. Create a **Firestore Database** (start in production mode)
5. Enable **Cloud Messaging**

### 4. Configure Environment Variables

#### Frontend Environment Variables

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key
```

**How to get Firebase config:**
1. Go to Firebase Console → Project Settings
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Copy the configuration values

**How to get VAPID Key:**
1. Go to Firebase Console → Project Settings → Cloud Messaging
2. Under "Web Push certificates", generate a new key pair
3. Copy the key value

#### Cloud Functions Environment Variables

Create `.env` file in the `functions` directory:

```bash
cd functions
cp .env.example .env
```

Edit `functions/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Set Firebase Functions config (alternative method):

```bash
firebase functions:config:set gemini.api_key="your_gemini_api_key"
```

### 5. Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 6. Run the Application

#### Development Mode (Local)

Start the React development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

#### Test Firebase Functions Locally (Optional)

```bash
cd functions
npm run serve
```

### 7. Deploy to Production

#### Build the React App
```bash
npm run build
```

#### Deploy Everything to Firebase
```bash
firebase deploy
```

Or deploy specific services:

```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

## 📂 Project Structure

```
d:\fpti assign 2 code\
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # React components
│   │   ├── Auth.js            # Authentication UI
│   │   ├── Dashboard.js       # Main dashboard
│   │   ├── AddTransaction.js  # Transaction form
│   │   ├── TransactionList.js # Transaction display
│   │   ├── BudgetOverview.js  # Budget visualization
│   │   └── AIInsights.js      # AI-generated insights
│   ├── contexts/
│   │   └── AuthContext.js     # Authentication context
│   ├── firebase/
│   │   ├── config.js          # Firebase initialization
│   │   ├── auth.js            # Authentication functions
│   │   ├── firestore.js       # Database operations
│   │   └── messaging.js       # Push notifications
│   ├── services/
│   │   └── geminiService.js   # Gemini AI integration
│   ├── App.js                 # Main app component
│   ├── App.css                # Global styles
│   ├── index.js               # Entry point
│   └── index.css              # Base styles
├── functions/
│   ├── index.js               # Cloud Functions
│   ├── package.json           # Functions dependencies
│   └── .env.example           # Functions environment template
├── firebase.json              # Firebase configuration
├── firestore.rules            # Security rules
├── firestore.indexes.json     # Database indexes
├── package.json               # Project dependencies
├── .env.example               # Environment template
└── README.md                  # This file
```

## 🔑 Key Features Explained

### 1. AI Analysis with Gemini

The app uses Gemini API for:
- **Spending Pattern Analysis** - Identifies trends and anomalies
- **Budget Recommendations** - Suggests personalized budget limits
- **Overspending Detection** - Proactively alerts users
- **Monthly Summaries** - Generates friendly, actionable insights
- **Adaptive Adjustments** - Recommends budget changes based on life events

### 2. Firebase Cloud Functions

Automated background tasks:
- **Daily Budget Checks** - Runs at 9 AM daily
- **Transaction Triggers** - Instant alerts on new transactions
- **Weekly Insights** - Generated every Monday at 8 AM
- **Smart Notifications** - FCM push notifications

### 3. Real-time Database

Firestore collections:
- `users/{userId}` - User profiles
- `users/{userId}/transactions` - Transaction history
- `users/{userId}/budgets` - Budget configurations
- `users/{userId}/insights` - AI-generated insights
- `users/{userId}/notifications` - Notification history

## 🔧 Configuration

### Firestore Security Rules

The app uses strict security rules to ensure users can only access their own data. Rules are defined in `firestore.rules`.

### Cloud Functions Scheduler

Functions are scheduled using Firebase Extensions. To enable:

1. Go to Firebase Console → Extensions
2. Install "Task Scheduler" extension
3. Configure schedule expressions

## 🧪 Testing

### Test User Authentication
1. Sign up with a new email
2. Verify email/password authentication works
3. Test logout functionality

### Test Transaction Management
1. Add a new transaction
2. Verify it appears in the dashboard
3. Check category calculations

### Test AI Features
1. Add multiple transactions
2. Wait for AI analysis to generate
3. Verify insights are displayed

### Test Notifications (Optional)
1. Enable notifications in browser
2. Add a transaction that exceeds budget
3. Verify alert is received

## 🚨 Troubleshooting

### Firebase Authentication Error
- Ensure Email/Password authentication is enabled in Firebase Console
- Check that `.env` variables are correctly set

### Gemini API Errors
- Verify your Gemini API key is valid
- Check API quota limits at [Google AI Studio](https://makersuite.google.com/)
- Ensure API key has proper permissions

### Cloud Functions Not Triggering
- Deploy functions: `firebase deploy --only functions`
- Check logs: `firebase functions:log`
- Verify environment variables are set

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# Clear functions cache
cd functions
rm -rf node_modules
npm install
```

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 (Not supported)

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Added to `.gitignore`
2. **Use Firebase Security Rules** - Already configured
3. **Validate user input** - Implemented in forms
4. **Rate limiting** - Configure in Firebase Console
5. **Regular security audits** - Run `npm audit`

## 📈 Performance Optimization

- **Lazy loading** - Components load on demand
- **Memoization** - React.memo for expensive components
- **Indexed queries** - Firestore indexes defined
- **Code splitting** - React Router based splitting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Firebase** - Backend infrastructure
- **Google Gemini** - AI-powered insights
- **React** - UI framework
- **Recharts** - Data visualization

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check Firebase documentation: https://firebase.google.com/docs
- Check Gemini API documentation: https://ai.google.dev/docs

## 🎯 Future Enhancements

- [ ] Multi-currency support
- [ ] Receipt scanning with OCR
- [ ] Financial goal tracking
- [ ] Export data to CSV/PDF
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Bank account integration
- [ ] Investment tracking
- [ ] Bill reminders
- [ ] Shared budgets for families

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install
cd functions && npm install && cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run locally
npm start

# Deploy to Firebase
npm run build
firebase deploy
```

---

**Built with ❤️ using Firebase and Gemini AI**
