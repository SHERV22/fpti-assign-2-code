const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

admin.initializeApp();

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Scheduled function to check for overspending daily
 * Runs every day at 9 AM
 */
exports.dailyBudgetCheck = onSchedule('0 9 * * *', async (event) => {
  console.log('Running daily budget check...');
  
  try {
    // Get all users
    const usersSnapshot = await db.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      // Get user's budget
      const budgetDoc = await db.collection('users').doc(userId)
        .collection('budgets').doc('current').get();
      
      if (!budgetDoc.exists) continue;
      
      const budget = budgetDoc.data();
      
      // Get current month's transactions
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const transactionsSnapshot = await db.collection('users').doc(userId)
        .collection('transactions')
        .where('date', '>=', admin.firestore.Timestamp.fromDate(startOfMonth))
        .where('type', '==', 'expense')
        .get();
      
      // Calculate spending by category
      const categorySpending = {};
      transactionsSnapshot.docs.forEach(doc => {
        const transaction = doc.data();
        const category = transaction.category || 'Other';
        categorySpending[category] = (categorySpending[category] || 0) + transaction.amount;
      });
      
      // Check for overspending
      const alerts = [];
      for (const [category, budgetAmount] of Object.entries(budget.categories || {})) {
        const spent = categorySpending[category] || 0;
        const percentage = (spent / budgetAmount) * 100;
        
        if (percentage >= 80) {
          alerts.push({
            category,
            spent,
            budget: budgetAmount,
            percentage: Math.round(percentage),
            severity: percentage >= 100 ? 'critical' : 'warning',
          });
        }
      }
      
      // Send notifications for alerts
      if (alerts.length > 0) {
        await sendBudgetAlerts(userId, alerts);
      }
    }
    
    console.log('Daily budget check completed');
  } catch (error) {
    console.error('Error in daily budget check:', error);
  }
});

/**
 * Trigger AI analysis when a new transaction is added
 */
exports.onTransactionAdded = onDocumentCreated(
  'users/{userId}/transactions/{transactionId}',
  async (event) => {
    const userId = event.params.userId;
    const transaction = event.data.data();
    
    console.log(`New transaction added for user ${userId}`);
    
    try {
      // Get user's budget
      const budgetDoc = await db.collection('users').doc(userId)
        .collection('budgets').doc('current').get();
      
      if (!budgetDoc.exists) return;
      
      const budget = budgetDoc.data();
      const category = transaction.category || 'Other';
      const categoryBudget = budget.categories?.[category];
      
      if (!categoryBudget) return;
      
      // Get current month's spending for this category
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const transactionsSnapshot = await db.collection('users').doc(userId)
        .collection('transactions')
        .where('category', '==', category)
        .where('date', '>=', admin.firestore.Timestamp.fromDate(startOfMonth))
        .where('type', '==', 'expense')
        .get();
      
      let totalSpent = 0;
      transactionsSnapshot.docs.forEach(doc => {
        totalSpent += doc.data().amount || 0;
      });
      
      const percentage = (totalSpent / categoryBudget) * 100;
      
      // Send alert if approaching or over budget
      if (percentage >= 80) {
        await sendCategoryAlert(userId, {
          category,
          spent: totalSpent,
          budget: categoryBudget,
          percentage: Math.round(percentage),
          severity: percentage >= 100 ? 'critical' : 'warning',
        });
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
    }
  }
);

/**
 * Weekly AI insights generation
 * Runs every Monday at 8 AM
 */
exports.weeklyInsightsGeneration = onSchedule('0 8 * * 1', async (event) => {
  console.log('Generating weekly insights...');
  
  try {
    const usersSnapshot = await db.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userProfile = userDoc.data();
      
      // Get last 7 days of transactions
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const transactionsSnapshot = await db.collection('users').doc(userId)
        .collection('transactions')
        .where('date', '>=', admin.firestore.Timestamp.fromDate(weekAgo))
        .orderBy('date', 'desc')
        .get();
      
      if (transactionsSnapshot.empty) continue;
      
      const transactions = transactionsSnapshot.docs.map(doc => ({
        ...doc.data(),
        date: doc.data().date.toDate(),
      }));
      
      // Generate AI insights
      const insights = await generateWeeklyInsights(transactions, userProfile);
      
      // Save insights
      await db.collection('users').doc(userId)
        .collection('insights')
        .add({
          ...insights,
          type: 'weekly',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      
      // Send notification
      await sendInsightsNotification(userId, insights);
    }
    
    console.log('Weekly insights generation completed');
  } catch (error) {
    console.error('Error generating weekly insights:', error);
  }
});

/**
 * Helper function to send budget alerts
 */
async function sendBudgetAlerts(userId, alerts) {
  try {
    // Get user's FCM token
    const userDoc = await db.collection('users').doc(userId).get();
    const fcmToken = userDoc.data()?.fcmToken;
    
    if (!fcmToken) return;
    
    // Create notification message
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    const warningAlerts = alerts.filter(a => a.severity === 'warning');
    
    let title = '💰 Budget Alert';
    let body = '';
    
    if (criticalAlerts.length > 0) {
      title = '🚨 Critical Budget Alert';
      body = `You've exceeded your budget in ${criticalAlerts.length} categor${criticalAlerts.length > 1 ? 'ies' : 'y'}!`;
    } else if (warningAlerts.length > 0) {
      body = `You're approaching your budget limit in ${warningAlerts.length} categor${warningAlerts.length > 1 ? 'ies' : 'y'}.`;
    }
    
    // Send notification
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data: {
        type: 'budget_alert',
        alerts: JSON.stringify(alerts),
      },
    });
    
    console.log(`Sent budget alert to user ${userId}`);
  } catch (error) {
    console.error('Error sending budget alert:', error);
  }
}

/**
 * Helper function to send category-specific alert
 */
async function sendCategoryAlert(userId, alert) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const fcmToken = userDoc.data()?.fcmToken;
    
    if (!fcmToken) return;
    
    const title = alert.severity === 'critical' 
      ? `🚨 Budget Exceeded: ${alert.category}`
      : `⚠️ Budget Alert: ${alert.category}`;
    
    const body = `You've used ${alert.percentage}% of your ${alert.category} budget ($${alert.spent.toFixed(2)} of $${alert.budget.toFixed(2)})`;
    
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data: {
        type: 'category_alert',
        category: alert.category,
      },
    });
    
    console.log(`Sent category alert to user ${userId}`);
  } catch (error) {
    console.error('Error sending category alert:', error);
  }
}

/**
 * Helper function to generate weekly insights using Gemini
 */
async function generateWeeklyInsights(transactions, userProfile) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const totalSpent = transactions.reduce((sum, t) => 
      sum + (t.type === 'expense' ? t.amount : 0), 0);
    
    const categoryTotals = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const cat = t.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
      }
    });
    
    const prompt = `
Generate a brief weekly spending summary (2-3 sentences).

Total spent this week: $${totalSpent.toFixed(2)}
Transactions: ${transactions.length}

Spending by category:
${JSON.stringify(categoryTotals, null, 2)}

Provide an encouraging, actionable insight. Keep it friendly and under 100 words.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    
    return {
      summary,
      totalSpent,
      transactionCount: transactions.length,
      topCategories: Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat]) => cat),
    };
  } catch (error) {
    console.error('Error generating insights:', error);
    return {
      summary: 'Keep up the good work tracking your expenses!',
      totalSpent: 0,
      transactionCount: 0,
      topCategories: [],
    };
  }
}

/**
 * Helper function to send insights notification
 */
async function sendInsightsNotification(userId, insights) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const fcmToken = userDoc.data()?.fcmToken;
    
    if (!fcmToken) return;
    
    await admin.messaging().send({
      token: fcmToken,
      notification: {
        title: '📊 Your Weekly Spending Insights',
        body: insights.summary.substring(0, 100) + '...',
      },
      data: {
        type: 'weekly_insights',
      },
    });
    
    console.log(`Sent weekly insights to user ${userId}`);
  } catch (error) {
    console.error('Error sending insights notification:', error);
  }
}
