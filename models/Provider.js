const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },

  address: { 
    type: String, 
    required: [true, 'Please add an address'] 
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [/^\d{10}$/, "Invalid phone number"],
  },

  car: {
    type : Object,
    required: [true, 'Please add a car'],
    model: {
      type: String,
      required: [true, "Please add a car model"],
    },
    brand: {
      type: String,
      required: [true, "Please add a car brand"],
    },
    pricePerDay: {
      type: Number,
      required: [true, "Please add price per day"],
    },
    imageURL: {
      type : String,
      required: [true, "Please add imageUrl"],
    }
  },
});

module.exports = mongoose.model("Provider", providerSchema);
