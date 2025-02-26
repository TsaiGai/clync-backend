const mongoose = require("mongoose");

const ApartmentSchema = new mongoose.Schema({
  apartment_name: { type: String, required: true },
  unit_type: { type: String, required: true },
  floorplan: { type: String, required: false },
  special_request: { type: String, required: false },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Reference to users
});

module.exports = mongoose.model("Apartment", ApartmentSchema);
