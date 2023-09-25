const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/pawsitively");

import { petOwner,petCareProvider,booking, petCareProvider } from './schemas';

const PetOwner = mongoose.model("PetOwner", petOwner);
const PetCareProvider = mongoose.model("PetCareProvider", petCareProvider);
const Booking = mongoose.model("Booking", booking);

module.exports.saveOwner = async(req)=>{
    const { username,password, firstName,lastName, email,phnNumber,type,Vaccine, userImage,add1,add2,city,state ,zipCode } = req.body
    const petowner = new PetOwner({
        uname: username,
        password: password,
        fname: firstName,
        lname: lastName,
        email: email,
        phno: phnNumber,
        pet_type: type,
        Vaccine_status: Vaccine,
        img_url: userImage,
        address: add1,
        address2: add2,
        city: city,
        state: state,
        zip: zipCode
    });
    petowner.save();
}

module.exports.saveProvider = async(req)=>{
    const { username,password,orgName,orgMail,organization,phoneNumber,altph,add1,add2,city,state,zipCode } = req.body;
    const petcareprovider = new PetCareProvider({
        uname: username,
        password: password,
        name: orgName,
        email: orgMail,
        org: organization,
        phno: phoneNumber,
        phno2: altph,
        address: add1,
        address2: add2,
        city: city,
        state: state,
        zip: zipCode
    });
    petcareprovider.save();
}

module.exports.saveBooking = async(req)=>{
    const { username,proName,date,agenda} = req.body;
    const booking = new Booking({
        uname: username,
        provider_name: proName,
        schedule: date,
        agenda: agenda
    });
    booking.save();
}