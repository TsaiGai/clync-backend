const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Get all apartments for a user (with userController)
router.get("/:userId/apartments", userController.getUserApartments);

module.exports = router;
