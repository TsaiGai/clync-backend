const User = require("../models/User");
const Apartment = require("../models/Apartment");

async function addUserToApartment(req, res) {
  const { userId } = req.params;

  try {
    // Find the user and populate their apartments
    const user = await User.findById(userId).populate("apartments").exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.apartments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch apartments" });
  }
}

module.exports = { addUserToApartment };
