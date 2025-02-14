const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Apartment = require("../models/Apartment");

// Get all apartments for a user (with userController)
router.get("/:userId/apartments", getUserApartments);

module.exports = router;
