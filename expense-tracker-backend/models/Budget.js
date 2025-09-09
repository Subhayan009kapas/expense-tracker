const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true }, // format: YYYY-MM
    limit: { type: Number, required: true },
    spent: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
