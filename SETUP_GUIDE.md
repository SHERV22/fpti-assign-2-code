# Quick Setup Guide 🚀

## Step-by-Step Installation

### 1️⃣ Install Dependencies

Open PowerShell in the project directory and run:

```powershell
# Install frontend dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### 2️⃣ Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or select existing one)
3. Click the **gear icon** → **Project settings**
4. Scroll to "Your apps" section
5. Click the **web icon** (`</>`) to add a web app
6. Copy the configuration object

### 3️⃣ Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key

### 4️⃣ Set Up Environment Variables

#### For the React App:

```powershell
# Copy the example file
Copy-Item .env.example .env
```

Edit `.env` and replace with your actual values:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-app-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_GEMINI_API_KEY=AIzaSyD...
```

#### For Firebase Functions:

```powershell
cd functions
Copy-Item .env.example .env
```

Edit `functions/.env`:

```env
GEMINI_API_KEY=AIzaSyD...
```

### 5️⃣ Enable Firebase Services

#### Enable Authentication:
1. Firebase Console → **Authentication**
2. Click **"Get Started"**
3. Enable **"Email/Password"** provider

#### Create Firestore Database:
1. Firebase Console → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose a location (e.g., us-central)

#### Enable Cloud Messaging:
1. Firebase Console → **Cloud Messaging**
2. Note: Should be enabled by default
3. Under "Web Push certificates", click **"Generate key pair"**
4. Copy the VAPID key to your `.env` file as `REACT_APP_FIREBASE_VAPID_KEY`

### 6️⃣ Initialize Firebase CLI

```powershell
# Login to Firebase
firebase login

# Initialize project (if needed)
firebase use --add
# Select your project from the list
```

### 7️⃣ Deploy Firestore Rules

```powershell
firebase deploy --only firestore:rules,firestore:indexes
```

### 8️⃣ Run the Application

```powershell
# Start development server
npm start
```

The app will open at **http://localhost:3000** 🎉

### 9️⃣ Deploy to Production (Optional)

```powershell
# Build the app
npm run build

# Deploy everything to Firebase
firebase deploy
```

## 🧪 Testing the Application

### Test Authentication:
1. Click "Sign Up"
2. Enter name, email, and password
3. You should be redirected to the dashboard

### Test Adding Transactions:
1. Click **"+ Add Transaction"**
2. Fill in the form:
   - Description: "Grocery shopping"
   - Amount: 50
   - Category: "Food & Groceries"
   - Date: Today
3. Click **"Add Transaction"**
4. Transaction should appear in the list

### Test AI Insights:
1. Add at least 5-10 transactions
2. Refresh the dashboard
3. AI insights should appear below transactions

## 🔧 Troubleshooting

### "Module not found" errors:
```powershell
rm -r node_modules
npm install
```

### Firebase deployment errors:
```powershell
# Make sure you're logged in
firebase login

# Make sure you've selected a project
firebase use --add
```

### AI insights not showing:
- Check your Gemini API key is correct
- Check browser console for errors
- Verify you have multiple transactions added

### Notifications not working:
- Check browser permissions (allow notifications)
- Verify VAPID key is set correctly
- Test in Chrome (best support)

## 📝 Important Notes

- **Never commit `.env` files** to version control
- **Free tier limits**: Firebase and Gemini have free tier quotas
- **Browser support**: Best experience in Chrome/Edge
- **Notifications**: Require HTTPS in production

## 🎯 Next Steps

1. ✅ Customize the UI colors in CSS files
2. ✅ Add more spending categories
3. ✅ Set up your monthly budget
4. ✅ Invite friends to test
5. ✅ Deploy to Firebase Hosting

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [React Documentation](https://react.dev/)

---

**Need help?** Check the main README.md file for detailed documentation.
