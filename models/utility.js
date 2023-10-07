const mongoose = require('mongoose');
//mongoose.connect("mongodb://localhost:27017/pawsitively");
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
        otp:-1,
        Verified:0,
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
        otp:-1,
        Verified:0,
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


module.exports.updateOtp = async(dt1)=>{
    const filter = { uname: dt1["username"] };
if(dt1["Utype"] == "provider" )
{
    const update = {
        $set: {
            otp:  dt1["otp"],
        },
      };
      const result = await PetCareProviderModel.updateOne(filter, update);
      if (result.modifiedCount === 1) {
        console.log('Document updated successfully');
      } else {
        console.log('No documents matched the criteria for update');
      }
}
else{
    const update = {
        $set: {
            otp:  dt1["otp"],
        },
      };
      const result = await PetOwnerModel.updateOne(filter, update);
      if (result.modifiedCount === 1) {
        console.log('Document updated successfully');
      } else {
        console.log('No documents matched the criteria for update');
      }
}
    
}

module.exports.verifyProvider = async(dt1)=>{
    const provider = await PetCareProviderModel.find({uname:dt1["username"]})
    
    if(provider[0]["otp"]==dt1["otp"])
    {
       
        const filter = { uname: dt1["username"] };
        const update = {
            $set: {
                Verified:  1,
            },
          };
          const result = await PetCareProviderModel.updateOne(filter, update);
          if (result.modifiedCount === 1) {
            console.log('Document updated successfully');
          } else {
            console.log('No documents matched the criteria for update');
          }
          console.log("user verified");
    }
    else
    {
        console.log(" user not verified");
    }

}

module.exports.saveService = async(req,res)=>{
    const { EName,ChargingFee, servicedescription ,noteworthy, username,pet_type} = req
    const service = new ServiceModel({
        serviceName: EName,
        serviceDescription: servicedescription,
        noteworthy: noteworthy,
        Fee: ChargingFee,
        uname: username,
        pet_type:pet_type
    });
    const provider = await PetCareProviderModel.find({uname:username})
    provider[0].services.push(service);
    await service.save()
    await provider[0].save()

    res.redirect(`services/${service._id}`);
}

module.exports.getServiceData = async(req,res)=>{

    try{
        if("body" in req && "keyword" in req.body){
            await ServiceModel.find({serviceName:{"$regex":req.body.keyword, "$options":"i"}}).then(function (items, err) {
                if (err) console.log(err);
                else {
                    res.render('services/service-list', { data: items })
                }
            })
        }
        else if("params" in req && "keyword" in req.params){
            await ServiceModel.find({"$or": [{serviceName:{"$regex":req.params.keyword, "$options":"i"}}, {pet_type:{"$regex":req.params.keyword, "$options":"i"} }]}).then(function (items, err) {
                if (err) console.log(err);
                else {
                    res.render('services/service-list', { data: items })
                }
            })
        }
        else{
            await ServiceModel.find({}).then(function (items, err) {
                if (err) console.log(err);
                else {
                    res.render('services/service-list', { data: items })
                }
            })
        }
    }catch(err){
        console.error(err);
            throw err;
    }  
}

module.exports.getCaretakerData = async(req,res)=>{
    try{
        if ("body" in req && "keyword" in req.body){
            
            await PetCareProviderModel.find({ uname: { "$regex": req.body.keyword, "$options": "i" } }).then(function (items, err) {
                if (err) console.log(err);
                else {
                    res.render('services/caretaker-list', { data: items })
                }
            })
        }
        else{
            await PetCareProviderModel.find({}).then(function (items, err) {
                if (err) console.log(err);
                else {
                    res.render('services/caretaker-list', { data: items })
                }
            })
        }
    }catch(err){
        console.error(err);
            throw err;
    }  
}

    
    

