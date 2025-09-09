const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// @desc    Set or update budget for a month
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res) => {
  try {
    const { month, limit } = req.body;

    if (!month || !limit) {
      return res.status(400).json({ message: "Month and limit are required" });
    }

    let budget = await Budget.findOne({ userId: req.user._id, month });

    if (budget) {
      budget.limit = limit;
      await budget.save();
    } else {
      budget = await Budget.create({
        userId: req.user._id,
        month,
        limit,
      });
    }

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get budget details for a month
// @route   GET /api/budgets/:month
// @access  Private
const getBudget = async (req, res) => {
  try {
    const month = req.params.month; // format: YYYY-MM
    const budget = await Budget.findOne({ userId: req.user._id, month });

    if (!budget) {
      return res.status(404).json({ message: "No budget set for this month" });
    }

    // Calculate spent from transactions
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const spentTransactions = await Transaction.find({
      userId: req.user._id,
      type: "expense",
      date: { $gte: startDate, $lt: endDate },
    });

    const totalSpent = spentTransactions.reduce((sum, t) => sum + t.amount, 0);
    budget.spent = totalSpent;
    await budget.save();

    let alert = null;
    if (totalSpent >= budget.limit) {
      alert = "⚠️ Budget exceeded!";
    } else if (totalSpent >= budget.limit * 0.8) {
      alert = "⚡ You are close to your budget limit!";
    }

    res.json({ ...budget._doc, alert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { setBudget, getBudget };
