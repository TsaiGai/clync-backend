// controllers/userController.js
const User = require("../models/User");

async function getUserApartments(req, res) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.apartments);
  } catch (error) {
    console.error("Error fetching apartments:", error);
    res.status(500).json({ error: "Failed to fetch apartments" });
  }
}

module.exports = { getUserApartments };
