const mongoose = require('mongoose');

// Creating a mongoose collection Schema
module.exports.petOwner = new mongoose.Schema({
    uname: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    fname: String,
    lname: String,
    email: String,
    phno: Number,
    pet_type: String,
    Vaccine_status: Boolean,
    img_url: String,
    address: String,
    address2: String,
    city: String,
    state: String,
    zip: Number
});

module.exports.petCareProvider = new mongoose.Schema({
    uname: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    name: String,
    email: String,
    org: String,
    phno: Number,
    phno2: Number,
    address: String,
    address2: String,
    city: String,
    state: String,
    zip: Number
});

module.exports.booking = new mongoose.Schema({
    uname: String,
    provider_name: String,
    schedule: Date,
    agenda: String
});


module.exports.service = new mongoose.Schema({
    serviceName: String,
    serviceDescription: String,
    experienceDescription: String,
    Fee: Number,
    uname: {
        type: String,
        required: true,
        unique: true
    },
});




