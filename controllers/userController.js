const User = require("../models/User");

async function getUserApartments(req, res) {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("apartments").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.apartments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch apartments" });
  }
}

module.exports = { getUserApartments };
