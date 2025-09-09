const express = require("express");
const { setBudget, getBudget } = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, setBudget); // Set/Update budget
router.get("/:month", protect, getBudget); // Get budget with spent + alerts

module.exports = router;
