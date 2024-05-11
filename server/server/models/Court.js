 const mongoose = require("mongoose");

const CourtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
   },
   location: {
    type: String,
    required: true,
  },
  company_id: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img_url: {
    type: String,
    default : "https://padelcreations.b-cdn.net/wp-content/uploads/2017/02/Front-page-padelcreations-4.jpg",
  },

 });

 const Court = mongoose.model("Court", CourtSchema);

 module.exports =  Court ;
