# 🎯 Setup Checklist

Use this checklist to ensure everything is properly configured.

## ✅ Pre-Installation

- [ ] Node.js installed (v18+)
- [ ] npm or yarn installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Firebase account created
- [ ] Google account for Gemini API

## ✅ Project Setup

- [ ] Dependencies installed (`npm install`)
- [ ] Functions dependencies installed (`cd functions && npm install`)
- [ ] `.env` file created from `.env.example`
- [ ] `functions/.env` file created

## ✅ Firebase Configuration

### Firebase Console Setup
- [ ] Firebase project created
- [ ] Project name noted: _______________
- [ ] Email/Password authentication enabled
- [ ] Firestore database created
- [ ] Cloud Messaging enabled
- [ ] Web Push certificate generated

### Firebase Config Obtained
- [ ] `apiKey` copied to `.env`
- [ ] `authDomain` copied to `.env`
- [ ] `projectId` copied to `.env`
- [ ] `storageBucket` copied to `.env`
- [ ] `messagingSenderId` copied to `.env`
- [ ] `appId` copied to `.env`
- [ ] `VAPID_KEY` copied to `.env`

### Firebase CLI
- [ ] Logged in (`firebase login`)
- [ ] Project selected (`firebase use --add`)
- [ ] Firestore rules deployed
- [ ] Firestore indexes deployed

## ✅ Gemini API

- [ ] Gemini API key obtained
- [ ] API key added to `.env` (frontend)
- [ ] API key added to `functions/.env` (backend)
- [ ] API quota checked

## ✅ Environment Variables

### Frontend (.env)
- [ ] `REACT_APP_FIREBASE_API_KEY`
- [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN`
- [ ] `REACT_APP_FIREBASE_PROJECT_ID`
- [ ] `REACT_APP_FIREBASE_STORAGE_BUCKET`
- [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `REACT_APP_FIREBASE_APP_ID`
- [ ] `REACT_APP_GEMINI_API_KEY`
- [ ] `REACT_APP_FIREBASE_VAPID_KEY`

### Backend (functions/.env)
- [ ] `GEMINI_API_KEY`

## ✅ Testing

### Basic Functionality
- [ ] App starts without errors (`npm start`)
- [ ] Login page loads
- [ ] Can create new account
- [ ] Can sign in
- [ ] Dashboard loads after login
- [ ] Can add transaction
- [ ] Transaction appears in list
- [ ] Can logout

### AI Features
- [ ] AI insights generate (after adding 5+ transactions)
- [ ] Insights display in dashboard
- [ ] Budget recommendations work
- [ ] Analysis text is coherent

### Budget Tracking
- [ ] Can set budget limits
- [ ] Progress bars display correctly
- [ ] Spending calculations are accurate
- [ ] Category totals correct

### Notifications (Optional)
- [ ] Browser notification permission requested
- [ ] Can enable notifications
- [ ] FCM token saved
- [ ] Alerts trigger on overspending

## ✅ Production Deployment

- [ ] All tests passing
- [ ] Production build created (`npm run build`)
- [ ] Build succeeds without errors
- [ ] Firebase deploy completed
- [ ] Hosting URL works
- [ ] Authentication works in production
- [ ] Database operations work
- [ ] Cloud Functions deployed
- [ ] Notifications work (if configured)

## 🐛 Common Issues & Solutions

### Issue: "Module not found"
**Solution:**
```powershell
rm -r node_modules
npm install
```

### Issue: Firebase authentication errors
**Solution:**
- Check Firebase Console → Authentication is enabled
- Verify Email/Password provider is enabled
- Check `.env` values match Firebase config

### Issue: AI insights not showing
**Solution:**
- Verify Gemini API key is correct
- Check browser console for errors
- Ensure you have 5+ transactions
- Check API quota at https://makersuite.google.com/

### Issue: "firebase command not found"
**Solution:**
```powershell
npm install -g firebase-tools
```

### Issue: Build fails
**Solution:**
- Check Node.js version: `node --version` (should be 18+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

### Issue: Notifications not working
**Solution:**
- Check browser supports notifications (Chrome recommended)
- Verify VAPID key is set correctly
- Check browser permissions (allow notifications)
- Test in incognito/private window

## 📊 Success Criteria

Your setup is complete when:

✅ You can sign up and sign in
✅ You can add transactions
✅ Transactions appear in the list
✅ AI insights generate after adding multiple transactions
✅ Budget overview shows spending progress
✅ No console errors
✅ All pages load correctly

## 🎉 Next Steps After Setup

1. **Customize the UI**
   - Modify colors in CSS files
   - Change category icons
   - Adjust layouts

2. **Add More Features**
   - Receipt uploads
   - Recurring transactions
   - Financial goals
   - Data export

3. **Optimize Performance**
   - Add loading states
   - Implement caching
   - Optimize queries

4. **Enhance Security**
   - Add rate limiting
   - Implement additional validation
   - Set up monitoring

5. **Share & Deploy**
   - Deploy to Firebase Hosting
   - Share with friends
   - Gather feedback

## 📝 Notes

Record any custom configurations or important information here:

**Firebase Project ID:** _______________

**Hosting URL:** _______________

**Custom Domain:** _______________

**Gemini API Quota:** _______________

**Deployment Date:** _______________

---

**Need Help?** Check README.md for detailed documentation or SETUP_GUIDE.md for step-by-step instructions.
