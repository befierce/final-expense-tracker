const { user, userExpense, Order, sequelize } = require("../models/user");

exports.getUserExpenseDataForLeaderboard = async (req, res) => {
  try {
    const users = await user.findAll({
      attributes: ["userId", "name"],
    });

    const expenses = await userExpense.findAll({
      attributes: [
        "userId",
        [sequelize.fn("SUM", sequelize.col("money")), "totalExpense"],
      ],
      group: ["userId"],
    });
    console.log(expenses);
    expenses.forEach((expense) => {
      userExpense[expense.userId] = expense.getDataValue("totalExpense");
    });

    // Create an array with userId, name, and totalExpense
    const leaderboard = users.map((user) => ({
      userId: user.getDataValue("userId"),
      name: user.getDataValue("name"),
      expenses: userExpense[user.getDataValue("userId")] || 0, // Default to 0 if no expenses found
    }));

    // Sort the leaderboard by total expenses in descending order
    leaderboard.sort((a, b) => b.expenses - a.expenses);

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
