const mongoose = require("mongoose");

const CoachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  about_me: {
    type: String,
    required: true,
  },
});

const Coaches = mongoose.model("Coaches", CoachSchema);

module.exports = Coaches;
