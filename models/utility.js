const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/pawsitively");
//const dbUrl = 'mongodb://localhost:27017/pawsitively';
const { petOwner,petCareProvider,booking,service } = require('./schemas');

const PetOwnerModel = mongoose.model("PetOwner", petOwner);
const PetCareProviderModel = mongoose.model("PetCareProvider", petCareProvider);
const BookingModel = mongoose.model("Booking", booking);
const ServiceModel = mongoose.model("Service", service);

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
        zip: zipCode,
        services: []
    });
    await petowner.save();
}

module.exports.saveProvider = async(req)=>{
    const { username,password,orgName,orgMail,organization,phoneNumber,about,designation,add1,city,state,zipCode } = req.body;
    const petcareprovider = new PetCareProviderModel({
        uname: username,
        password: password,
        name: orgName,
        email: orgMail,
        org: organization,
        phno: phoneNumber,
        designation: designation,
        address: add1,
        about: about,
        city: city,
        state: state,
        zip: zipCode,
        services: []
    });
    await petcareprovider.save();
}

module.exports.saveBooking = async(req)=>{
    const { username,proName,date,agenda} = req.body;
    const booking = new BookingModel({
        uname: username,
        provider_name: proName,
        schedule: date,
        agenda: agenda
    });
    await booking.save();
}



module.exports.saveService = async(req)=>{
    const { EName,ChargingFee, servicedescription ,noteworthy, username} = req
    const service = new ServiceModel({
        serviceName: EName,
        serviceDescription: servicedescription,
        noteworthy: noteworthy,
        Fee: ChargingFee,
        uname: username
    });
    const provider = await PetCareProviderModel.find({uname:username})
    provider[0].services.push(service);
    await service.save()
    await provider[0].save()

    res.redirect(`services/${service._id}`);
}

module.exports.getServiceData = async(req,res)=>{
    try{
        await ServiceModel.find({}).then(function (items, err) {
            if (err) console.log(err);
            else {
                // console.log(items);
                res.render('services/service-list', {data:items} )
            }
        })
    }catch(err){
        console.error(err);
            throw err;
    }  
}

module.exports.getCaretakerData = async(req,res)=>{
    try{
        await PetCareProviderModel.find({}).then(function (items, err) {
            if (err) console.log(err);
            else {
                // console.log(items);
                res.render('services/caretaker-list', {data: items})
            }
        })
    }catch(err){
        console.error(err);
            throw err;
    }  
}

    
    

