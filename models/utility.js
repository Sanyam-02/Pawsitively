const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/pawsitively");

const { petOwner,petCareProvider,booking } = require('./schemas');

const PetOwnerModel = mongoose.model("PetOwner", petOwner);
const PetCareProviderModel = mongoose.model("PetCareProvider", petCareProvider);
const BookingModel = mongoose.model("Booking", booking);

module.exports.saveOwner = async(req)=>{
    const { username,password, firstName,lastName, email,phnNumber,type,Vaccine, userImage,add1,add2,city,state ,zipCode } = req.body
    const petowner = new PetOwnerModel({
        uname: username,
        password: password,
        fname: firstName,
        lname: lastName,
        email: email,
        phno: phnNumber,
        pet_type: type,
        Vaccine_status: Vaccine == 'true'? true: false,
        img_url: userImage,
        address: add1,
        address2: add2,
        city: city,
        state: state,
        zip: zipCode
    });
    await PetOwnerModel.find({ uname: username }).then(function (items, err) {
        if (err) console.log(err);
        else {
            if (items.length != 0) {
                console.log("User already registered");
            }
            else {
                petowner.save();
            }
        }
    })
}

module.exports.saveProvider = async(req)=>{
    const { username,password,orgName,orgMail,organization,phoneNumber,altph,add1,add2,city,state,zipCode } = req.body;
    const petcareprovider = new PetCareProviderModel({
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
    PetCareProviderModel.find({ uname: username }).then(function (err, items) {
        if (err) console.log(err);
        else {
            if (items.length != 0) {
                alert("User already registered");
            }
            else {
                petcareprovider.save();
            }
        }
    })
}

module.exports.saveBooking = async(req)=>{
    const { username,proName,date,agenda} = req.body;
    const booking = new BookingModel({
        uname: username,
        provider_name: proName,
        schedule: date,
        agenda: agenda
    });
    booking.save();
}