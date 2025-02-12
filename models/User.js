const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  apartments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Apartment" }] // Reference to apartments
});

module.exports = mongoose.model("User", UserSchema);
