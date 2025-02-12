const User = require("../models/User");
const Apartment = require("../models/Apartment");

const addUserToApartment = async (req, res) => {
  try {
    const { userId, apartmentId } = req.params;

    // Find user and apartment
    const user = await User.findById(userId);
    const apartment = await Apartment.findById(apartmentId);

    if (!user || !apartment) {
      return res.status(404).json({ error: "User or Apartment not found" });
    }

    // Prevent duplicate entries
    if (!user.apartments.includes(apartmentId)) {
      user.apartments.push(apartmentId);
      await user.save();
    }

    if (!apartment.users.includes(userId)) {
      apartment.users.push(userId);
      await apartment.save();
    }

    res.status(200).json({ message: "User successfully added to apartment" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addUserToApartment };
