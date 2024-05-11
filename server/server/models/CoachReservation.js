const mongoose = require("mongoose");

const CoachReservationSchema = new mongoose.Schema({

    coach_id: {
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
  slots : {
      type : [String],
      required : true,
      default : []
  },
  max_capacity : {
      type : Number,
      required : true
  },
  price : {
      type : Number,
      required : true
  },

  court_id: {
    type: String,
    required: true,
  }
  
});

const CoachReservation = mongoose.model("CoachReservation", CoachReservationSchema);

module.exports = CoachReservation ;




