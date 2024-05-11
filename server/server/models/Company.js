const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, unique: true

    },

    phone: {
        type: Number,
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
    profile_image : {
        default : "",
        type : String,
    }
}
);

const Company = mongoose.model("Company", CompanySchema);

module.exports = Company ;



