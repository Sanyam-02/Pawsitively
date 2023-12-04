const mongoose = require('mongoose');
const Schema = mongoose.Schema

// Creating a mongoose collection Schema
module.exports.petOwner = new mongoose.Schema({
    uname: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    otp:Number,
    Verified:Boolean,
    fname: String,
    lname: String,
    email: String,
    phno: Number,
    pet_type: String,
    Vaccine_status: Boolean,
    address: String,
    address2: String,
    city: String,
    state: String,
    zip: Number
});



module.exports.booking = new mongoose.Schema({
    uname: String,
    provider_name: String,
    sid: {
        type: Schema.Types.ObjectId,
        ref: "ServiceModel"
    },
    email: String,
    phoneNumber: Number,
    address: String,
    date: String,
    time: String
});
const BookingModel = mongoose.model("BookingModel", this.booking);

module.exports.service = new mongoose.Schema({
    serviceName: String,
    serviceDescription: String,
    noteworthy: String,
    Fee: Number,
    pet_type: String,
    service_type:String,
    uname: {
        type: String,
        required: true
    },
    bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: "BookingModel"
        }
    ]
});

const ServiceModel = mongoose.model("ServiceModel", this.service);

module.exports.petCareProvider = new mongoose.Schema({
    uname: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    otp:Number,
    Verified:Boolean,
    name: String,
    email: String,
    org: String,
    phno: Number,
    designation:String,
    address: String,
    about: String,
    img_url: String,
    city: String,
    state: String,
    zip: Number,
    services: [
        {   
            type: Schema.Types.ObjectId,
            ref: "ServiceModel"
        }
    ]
});
