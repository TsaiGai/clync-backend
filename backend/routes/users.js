const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Apartment = require("../models/Apartment");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET a specific user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Assign a user to an apartment
router.post("/:userId/apartments/:apartmentId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const apartment = await Apartment.findById(req.params.apartmentId);

    if (!user || !apartment) {
      return res.status(404).json({ error: "User or Apartment not found" });
    }

    // Add apartment to user's list
    user.apartments.push(apartment._id);
    await user.save();

    // Optionally: Add user to apartment's users list
    apartment.users.push(user._id);
    await apartment.save();

    res.json({ message: "User assigned to apartment successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to assign user to apartment" });
  }
});

// Get all apartments for a user
router.get("/:userId/apartments", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("apartments");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.apartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
