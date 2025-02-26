const express = require("express");
const router = express.Router();
const Apartment = require("../models/Apartment");
const User = require("../models/User");

// ❌ Disable GET all apartments (only for admin or remove completely)
router.get("/", async (req, res) => {
  return res.status(403).json({ error: "Access denied" });
});

// ✅ ADD a new apartment
router.post("/", async (req, res) => {
  try {
    const { apartment_name, unit_type, users } = req.body;
        
    if (!apartment_name || !unit_type) {
      return res.status(400).json({ error: "apartment_name and unit_type are required" });
    }

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: "At least one user ID must be provided" });
    }

    const newApartment = new Apartment(req.body);
    await newApartment.save();

    // ✅ Associate the apartment with users
    await User.updateMany(
      { _id: { $in: users } },
      { $push: { apartments: newApartment._id } }
    );

    res.status(201).json(newApartment);
  } catch (error) {
    console.error("Error creating apartment:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ UPDATE an apartment and ensure it belongs to one of the provided users
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { apartment_name, unit_type, users } = req.body;
    console.log("Received request to update apartment:", { id, apartment_name, unit_type, users });

    // Validate required fields
    if (!apartment_name || !unit_type) {
      return res.status(400).json({ error: "apartment_name and unit_type are required" });
    }

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: "At least one user ID must be provided" });
    }

    // Ensure the apartment exists and belongs to one of the provided users
    const apartment = await Apartment.findOne({ _id: id, users: { $in: users } });

    if (!apartment) {
      return res.status(404).json({ error: "Apartment not found or you do not have permission to edit this apartment" });
    }

    // ✅ Update apartment
    const updatedApartment = await Apartment.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedApartment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update apartment" });
  }
});

// ✅ DELETE an apartment
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(404).json({ error: "Apartment not found" });
    }

    // ✅ Remove the apartment from users
    await User.updateMany(
      { apartments: id },
      { $pull: { apartments: id } }
    );

    // ✅ Delete the apartment
    await Apartment.findByIdAndDelete(id);

    res.json({ message: "Apartment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete apartment" });
  }
});

module.exports = router;
