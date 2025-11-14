import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

/**
 * Analyze spending patterns and generate insights
 */
export const analyzeSpendingPatterns = async (transactions, userProfile) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Prepare transaction summary
    const summary = prepareTransactionSummary(transactions);
    
    const prompt = `
You are a financial advisor analyzing a user's spending patterns.

User Profile:
- Monthly Income: ₹${userProfile.monthlyIncome || 0}
- Currency: ${userProfile.currency || 'INR'}

Transaction Summary (Last 30 days):
${summary}

Please provide:
1. A brief analysis of spending patterns (2-3 sentences)
2. Top 3 spending categories
3. Any concerning trends or overspending areas
4. One actionable recommendation

Keep your response concise, friendly, and actionable. Format as JSON:
{
  "analysis": "Brief analysis text",
  "topCategories": ["category1", "category2", "category3"],
  "concerns": ["concern1", "concern2"],
  "recommendation": "One key recommendation"
}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      analysis: text,
      topCategories: [],
      concerns: [],
      recommendation: 'Continue monitoring your spending habits.',
    };
  } catch (error) {
    console.error('Error analyzing spending patterns:', error);
    throw error;
  }
};

/**
 * Generate personalized budget recommendations
 */
export const generateBudgetRecommendations = async (transactions, userProfile, currentBudget = null) => {
  try {
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const summary = prepareTransactionSummary(transactions);
    const currentBudgetInfo = currentBudget 
      ? `Current Budget:\n${JSON.stringify(currentBudget.categories, null, 2)}`
      : 'No current budget set';

    const prompt = `
You are a financial advisor creating a personalized budget plan.

User Profile:
- Monthly Income: ₹${userProfile.monthlyIncome || 0}

${currentBudgetInfo}

Recent Spending (Last 30 days):
${summary}

Based on the 50/30/20 rule (50% needs, 30% wants, 20% savings) and the user's actual spending patterns, suggest realistic monthly budget limits for these categories:
- Housing
- Food & Groceries
- Transportation
- Utilities
- Entertainment
- Shopping
- Healthcare
- Savings
- Other

Provide your recommendations as JSON:
{
  "categories": {
    "Housing": amount,
    "Food & Groceries": amount,
    "Transportation": amount,
    "Utilities": amount,
    "Entertainment": amount,
    "Shopping": amount,
    "Healthcare": amount,
    "Savings": amount,
    "Other": amount
  },
  "reasoning": "Brief explanation of your recommendations"
}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse budget recommendations');
  } catch (error) {
    console.error('Error generating budget recommendations:', error);
    throw error;
  }
};

/**
 * Detect potential overspending in specific categories
 */
export const detectOverspending = async (transactions, budget, userProfile) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Calculate spending by category
    const categorySpending = calculateCategorySpending(transactions);
    
    const prompt = `
You are monitoring a user's spending for potential overspending alerts.

Monthly Income: ₹${userProfile.monthlyIncome || 0}

Budget Limits:
${JSON.stringify(budget.categories, null, 2)}

Current Spending (This Month):
${JSON.stringify(categorySpending, null, 2)}

Identify any categories where spending is approaching or exceeding budget limits. Provide alerts as JSON:
{
  "alerts": [
    {
      "category": "category name",
      "spent": amount,
      "budget": amount,
      "percentage": percentage,
      "severity": "warning|critical",
      "message": "Friendly alert message"
    }
  ],
  "overallStatus": "on_track|warning|critical"
}

Mark as "warning" if 80-99% of budget used, "critical" if 100%+ used.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      alerts: [],
      overallStatus: 'on_track',
    };
  } catch (error) {
    console.error('Error detecting overspending:', error);
    throw error;
  }
};

/**
 * Generate monthly spending summary
 */
export const generateMonthlySummary = async (transactions, budget, userProfile) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const totalSpent = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const categorySpending = calculateCategorySpending(transactions);

    const prompt = `
Create a friendly monthly spending summary for a user.

Monthly Income: ₹${userProfile.monthlyIncome || 0}
Total Spent: ₹${totalSpent.toFixed(2)}

Spending by Category:
${JSON.stringify(categorySpending, null, 2)}

Budget:
${JSON.stringify(budget?.categories || {}, null, 2)}

Provide a friendly, encouraging summary (2-3 paragraphs) that:
1. Highlights overall performance
2. Mentions top spending categories
3. Offers one piece of positive reinforcement or advice
4. Keeps tone supportive and non-judgmental

Keep it concise and actionable.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating monthly summary:', error);
    throw error;
  }
};

/**
 * Suggest budget adjustments based on life changes
 */
export const suggestBudgetAdjustments = async (lifeChange, currentBudget, userProfile) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
A user experienced a life change: "${lifeChange}"

Current Monthly Income: ₹${userProfile.monthlyIncome || 0}

Current Budget:
${JSON.stringify(currentBudget.categories, null, 2)}

Suggest how to adjust their budget to accommodate this change. Provide response as JSON:
{
  "adjustments": {
    "Category Name": {
      "oldAmount": current_amount,
      "newAmount": suggested_amount,
      "reason": "why this adjustment"
    }
  },
  "summary": "Brief explanation of overall adjustments"
}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse budget adjustments');
  } catch (error) {
    console.error('Error suggesting budget adjustments:', error);
    throw error;
  }
};

// Helper functions

function prepareTransactionSummary(transactions) {
  const categoryTotals = calculateCategorySpending(transactions);
  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  let summary = `Total Spent: ₹${total.toFixed(2)}\n\nBy Category:\n`;
  for (const [category, amount] of Object.entries(categoryTotals)) {
    summary += `- ${category}: ₹${amount.toFixed(2)}\n`;
  }
  
  return summary;
}

function calculateCategorySpending(transactions) {
  const categoryTotals = {};
  
  transactions.forEach((transaction) => {
    const category = transaction.category || 'Other';
    const amount = transaction.amount || 0;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  });
  
  return categoryTotals;
}

export default {
  analyzeSpendingPatterns,
  generateBudgetRecommendations,
  detectOverspending,
  generateMonthlySummary,
  suggestBudgetAdjustments,
};
