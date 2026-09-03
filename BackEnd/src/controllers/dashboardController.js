const Building = require('../models/Building');
const Employee = require('../models/Employee');
const Lead = require('../models/Lead');
const Revenue = require('../models/Revenue');

// ✅ Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // ✅ Buildings Stats
    const buildings = await Building.find();
    const totalBuildings = buildings.length;
    const activeBuildings = buildings.filter(b => b.status === 'Active').length;
    
    let totalRooms = 0;
    let rentedRooms = 0;
    let availableRooms = 0;
    
    buildings.forEach(b => {
      totalRooms += (b.rooms || []).length;
      rentedRooms += (b.rooms || []).filter(r => r.status === 'Rented').length;
      availableRooms += (b.rooms || []).filter(r => r.status === 'Available').length;
    });

    // ✅ Employees Stats
    const employees = await Employee.find();
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    
    // ✅ Leads Stats
    const leads = await Lead.find();
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length;
    const convertedLeads = leads.filter(l => l.status === 'Converted').length;
    const lostLeads = leads.filter(l => l.status === 'Lost').length;

    // ✅ Revenue Stats
    const revenue = await Revenue.findOne();
    let totalRevenue = 0;
    let totalExpenses = 0;
    let netProfit = 0;
    let includeSecurities = false;
    
    if (revenue) {
      const income = revenue.income || [];
      const expenses = revenue.expenses || [];
      const securities = revenue.securities || [];
      
      totalRevenue = income.reduce((sum, i) => sum + (i.amount || 0), 0);
      totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      
      if (revenue.includeSecurities) {
        const securitiesTotal = securities
          .filter(s => s.status === 'Held')
          .reduce((sum, s) => sum + (s.amount || 0), 0);
        totalRevenue += securitiesTotal;
      }
      
      netProfit = totalRevenue - totalExpenses;
      includeSecurities = revenue.includeSecurities || false;
    }

    // ✅ Recent Activities (combine from multiple sources)
    const recentActivities = [];

    // Add recent leads
    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(3);
    recentLeads.forEach(lead => {
      recentActivities.push({
        id: `lead-${lead._id}`,
        type: 'lead',
        title: 'New Lead Added',
        description: `${lead.customerName} - ${lead.type}`,
        time: lead.createdAt,
        icon: 'UserPlus',
        iconColor: 'text-indigo-400',
      });
    });

    // Add recent rent payments (from revenue)
    if (revenue) {
      const recentIncomes = (revenue.income || [])
        .filter(i => i.type === 'Income' || i.category === 'Rent')
        .slice(-3)
        .reverse();
      
      recentIncomes.forEach(inc => {
        recentActivities.push({
          id: `income-${inc.id}`,
          type: 'rent',
          title: 'Rent Payment Received',
          description: `${inc.description || 'Rent payment'} - Rs. ${(inc.amount || 0).toLocaleString()}`,
          time: inc.createdAt,
          icon: 'DollarSign',
          iconColor: 'text-emerald-400',
        });
      });

      // Add recent salary payments (from expenses)
      const recentExpenses = (revenue.expenses || [])
        .filter(e => e.category === 'Salary')
        .slice(-2)
        .reverse();
      
      recentExpenses.forEach(exp => {
        recentActivities.push({
          id: `expense-${exp.id}`,
          type: 'salary',
          title: 'Salary Paid',
          description: `${exp.description || 'Salary payment'} - Rs. ${(exp.amount || 0).toLocaleString()}`,
          time: exp.createdAt,
          icon: 'User',
          iconColor: 'text-blue-400',
        });
      });
    }

    // Sort activities by time (newest first)
    recentActivities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const topActivities = recentActivities.slice(0, 5);

    // ✅ Alerts
    const alerts = [];

    // Check pending salaries
    if (revenue) {
      const pendingSalaries = (revenue.expenses || [])
        .filter(e => e.category === 'Salary' && e.status === 'Pending');
      
      if (pendingSalaries.length > 0) {
        alerts.push({
          id: 'alert-1',
          type: 'warning',
          title: `${pendingSalaries.length} Salary Payments Pending`,
          description: `${pendingSalaries.length} employees have pending salary payments`,
          icon: 'Clock',
          color: 'text-amber-400 bg-amber-500/10',
        });
      }
    }

    // Check available rooms
    if (availableRooms === 0 && totalRooms > 0) {
      alerts.push({
        id: 'alert-2',
        type: 'info',
        title: 'No Rooms Available',
        description: 'All rooms are currently occupied',
        icon: 'AlertCircle',
        color: 'text-blue-400 bg-blue-500/10',
      });
    }

    // Check pending leads
    if (newLeads > 0) {
      alerts.push({
        id: 'alert-3',
        type: 'info',
        title: `${newLeads} New Leads`,
        description: `${newLeads} new leads need attention`,
        icon: 'AlertCircle',
        color: 'text-blue-400 bg-blue-500/10',
      });
    }

    // Check revenue
    if (netProfit < 0) {
      alerts.push({
        id: 'alert-4',
        type: 'error',
        title: 'Negative Profit',
        description: 'Current month revenue is negative',
        icon: 'AlertCircle',
        color: 'text-red-400 bg-red-500/10',
      });
    }

    // ✅ Response
    res.status(200).json({
      success: true,
      data: {
        stats: {
          buildings: {
            total: totalBuildings,
            active: activeBuildings,
            rooms: {
              total: totalRooms,
              rented: rentedRooms,
              available: availableRooms,
              occupancyRate: totalRooms > 0 ? Math.round((rentedRooms / totalRooms) * 100) : 0,
            },
          },
          employees: {
            total: totalEmployees,
            active: activeEmployees,
          },
          leads: {
            total: totalLeads,
            new: newLeads,
            qualified: qualifiedLeads,
            converted: convertedLeads,
            lost: lostLeads,
          },
          revenue: {
            total: totalRevenue,
            expenses: totalExpenses,
            netProfit: netProfit,
            includeSecurities: includeSecurities,
          },
        },
        recentActivities: topActivities,
        alerts: alerts,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get revenue chart data
exports.getRevenueChart = async (req, res) => {
  try {
    const revenue = await Revenue.findOne();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize 12 months with 0
    const monthlyData = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    if (revenue) {
      const income = revenue.income || [];
      
      income.forEach(inc => {
        if (inc.createdAt) {
          const date = new Date(inc.createdAt);
          if (date.getFullYear() === currentYear) {
            const month = date.getMonth();
            monthlyData[month] += (inc.amount || 0);
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        categories: monthNames,
        series: [
          {
            name: 'Revenue',
            data: monthlyData,
          },
        ],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get recent leads (for dashboard card)
exports.getRecentLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(5);
    
    const formattedLeads = leads.map(lead => ({
      id: lead._id,
      customerName: lead.customerName,
      customerPhone: lead.customerPhone,
      customerEmail: lead.customerEmail || '',
      type: lead.type,
      status: lead.status,
      assignedToName: lead.assignedToName,
      createdAt: lead.createdAt,
    }));

    // Stats
    const stats = {
      total: await Lead.countDocuments(),
      new: await Lead.countDocuments({ status: 'New' }),
      contacted: await Lead.countDocuments({ status: 'Contacted' }),
      qualified: await Lead.countDocuments({ status: 'Qualified' }),
      converted: await Lead.countDocuments({ status: 'Converted' }),
      lost: await Lead.countDocuments({ status: 'Lost' }),
    };

    res.status(200).json({
      success: true,
      data: {
        leads: formattedLeads,
        stats: stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};