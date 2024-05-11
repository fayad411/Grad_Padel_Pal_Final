const mongoose = require("mongoose");

const CourtRervationSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
 
  phone: {
    type: Number,
    required: true,
  },
  startingTime: {
    type: Date,
    required: true,
  },
  endingTime: {
    type: Date,
    required: true,
  },
  court_id: {
    type: String,
    required: true,
  }
  
});

const CourtRervation = mongoose.model("CourtReservation", CourtRervationSchema);

module.exports =  CourtRervation ;




