const Revenue = require('../models/Revenue');

// ✅ Get revenue data
exports.getRevenue = async (req, res) => {
  try {
    // Get first revenue document or create if not exists
    let revenue = await Revenue.findOne();
    
    if (!revenue) {
      revenue = await Revenue.create({
        income: [],
        expenses: [],
        securities: [],
        includeSecurities: false,
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
      });
    }

    // Calculate totals
    const totalIncome = revenue.income.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpenses = revenue.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalSecurities = revenue.securities
      .filter(s => s.status === 'Held')
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    
    const totalRevenue = revenue.includeSecurities ? totalIncome + totalSecurities : totalIncome;
    
    // Update cached values
    revenue.totalRevenue = totalRevenue;
    revenue.totalExpenses = totalExpenses;
    revenue.netProfit = totalRevenue - totalExpenses;
    await revenue.save();

    res.status(200).json({
      success: true,
      data: revenue,
      stats: {
        totalIncome,
        totalExpenses,
        totalSecurities,
        totalRevenue,
        netProfit: totalRevenue - totalExpenses,
        includeSecurities: revenue.includeSecurities,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Toggle securities inclusion
exports.toggleSecurities = async (req, res) => {
  try {
    let revenue = await Revenue.findOne();
    
    if (!revenue) {
      revenue = await Revenue.create({
        income: [],
        expenses: [],
        securities: [],
        includeSecurities: false,
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
      });
    }

    revenue.includeSecurities = !revenue.includeSecurities;
    
    // Recalculate
    const totalIncome = revenue.income.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpenses = revenue.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalSecurities = revenue.securities
      .filter(s => s.status === 'Held')
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    
    const totalRevenue = revenue.includeSecurities ? totalIncome + totalSecurities : totalIncome;
    
    revenue.totalRevenue = totalRevenue;
    revenue.totalExpenses = totalExpenses;
    revenue.netProfit = totalRevenue - totalExpenses;
    await revenue.save();

    res.status(200).json({
      success: true,
      message: `Securities ${revenue.includeSecurities ? 'included' : 'excluded'} successfully.`,
      data: revenue,
      stats: {
        totalIncome,
        totalExpenses,
        totalSecurities,
        totalRevenue,
        netProfit: totalRevenue - totalExpenses,
        includeSecurities: revenue.includeSecurities,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Add income
exports.addIncome = async (req, res) => {
  try {
    let revenue = await Revenue.findOne();
    
    if (!revenue) {
      revenue = await Revenue.create({
        income: [],
        expenses: [],
        securities: [],
        includeSecurities: false,
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
      });
    }

    const incomeData = {
      ...req.body,
      id: req.body.id || `income-${Date.now()}`,
      createdAt: req.body.createdAt || new Date().toISOString(),
      receivedAt: req.body.receivedAt || new Date().toISOString(),
    };

    revenue.income.push(incomeData);
    
    // Recalculate
    const totalIncome = revenue.income.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpenses = revenue.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalSecurities = revenue.securities
      .filter(s => s.status === 'Held')
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    
    const totalRevenue = revenue.includeSecurities ? totalIncome + totalSecurities : totalIncome;
    
    revenue.totalRevenue = totalRevenue;
    revenue.totalExpenses = totalExpenses;
    revenue.netProfit = totalRevenue - totalExpenses;
    await revenue.save();

    res.status(201).json({
      success: true,
      message: 'Income added successfully.',
      data: revenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Add expense
exports.addExpense = async (req, res) => {
  try {
    let revenue = await Revenue.findOne();
    
    if (!revenue) {
      revenue = await Revenue.create({
        income: [],
        expenses: [],
        securities: [],
        includeSecurities: false,
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
      });
    }

    const expenseData = {
      ...req.body,
      id: req.body.id || `expense-${Date.now()}`,
      createdAt: req.body.createdAt || new Date().toISOString(),
      paidAt: req.body.paidAt || new Date().toISOString(),
    };

    revenue.expenses.push(expenseData);
    
    // Recalculate
    const totalIncome = revenue.income.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpenses = revenue.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalSecurities = revenue.securities
      .filter(s => s.status === 'Held')
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    
    const totalRevenue = revenue.includeSecurities ? totalIncome + totalSecurities : totalIncome;
    
    revenue.totalRevenue = totalRevenue;
    revenue.totalExpenses = totalExpenses;
    revenue.netProfit = totalRevenue - totalExpenses;
    await revenue.save();

    res.status(201).json({
      success: true,
      message: 'Expense added successfully.',
      data: revenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Add security
exports.addSecurity = async (req, res) => {
  try {
    let revenue = await Revenue.findOne();
    
    if (!revenue) {
      revenue = await Revenue.create({
        income: [],
        expenses: [],
        securities: [],
        includeSecurities: false,
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
      });
    }

    const securityData = {
      ...req.body,
      id: req.body.id || `security-${Date.now()}`,
      status: req.body.status || 'Held',
      createdAt: req.body.createdAt || new Date().toISOString(),
    };

    revenue.securities.push(securityData);
    
    // Recalculate
    const totalIncome = revenue.income.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpenses = revenue.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalSecurities = revenue.securities
      .filter(s => s.status === 'Held')
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    
    const totalRevenue = revenue.includeSecurities ? totalIncome + totalSecurities : totalIncome;
    
    revenue.totalRevenue = totalRevenue;
    revenue.totalExpenses = totalExpenses;
    revenue.netProfit = totalRevenue - totalExpenses;
    await revenue.save();

    res.status(201).json({
      success: true,
      message: 'Security added successfully.',
      data: revenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get transactions (combined)
exports.getTransactions = async (req, res) => {
  try {
    let revenue = await Revenue.findOne();
    
    if (!revenue) {
      revenue = await Revenue.create({
        income: [],
        expenses: [],
        securities: [],
        includeSecurities: false,
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
      });
    }

    const transactions = [];

    // Add income
    revenue.income.forEach(inc => {
      transactions.push({
        ...inc._doc,
        type: 'Income',
        date: inc.receivedAt || inc.createdAt,
      });
    });

    // Add expenses
    revenue.expenses.forEach(exp => {
      transactions.push({
        ...exp._doc,
        type: 'Expense',
        date: exp.paidAt || exp.createdAt,
      });
    });

    // Add securities (if included)
    if (revenue.includeSecurities) {
      revenue.securities
        .filter(s => s.status === 'Held')
        .forEach(sec => {
          transactions.push({
            ...sec._doc,
            type: 'Security',
            date: sec.createdAt,
          });
        });
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};