const mongoose = require('mongoose');
//mongoose.connect("mongodb://localhost:27017/pawsitively");
//const dbUrl = 'mongodb://localhost:27017/pawsitively';
const { petOwner,petCareProvider,booking,service } = require('./schemas');

const PetOwnerModel = mongoose.model("PetOwner", petOwner);
const PetCareProviderModel = mongoose.model("PetCareProvider", petCareProvider);
const BookingModel = mongoose.model("Booking", booking);
const ServiceModel = mongoose.model("Service", service);

module.exports.saveOwner = async(req)=>{
    const { username,password, firstName,lastName, email,phnNumber,type,Vaccine,add1,add2,city,state ,zipCode } = req.body
    const petowner = new PetOwnerModel({
        uname: username,
        password: password,
        fname: firstName,
        lname: lastName,
        email: email,
        phno: phnNumber,
        pet_type: type,
        Vaccine_status: Vaccine == 'true'? true: false,
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
    const { username,password,orgName,orgMail,organization,phoneNumber, userImage, about,designation,add1,city,state,zipCode } = req.body;
    const petcareprovider = new PetCareProviderModel({
        uname: username,
        password: password,
        name: orgName,
        email: orgMail,
        org: organization,
        phno: phoneNumber,
        img_url: userImage,
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

module.exports.saveBooking = async(dt1,res)=>{
    sr = await ServiceModel.findById(String(dt1.id));

    const booking = new BookingModel({
        uname: dt1.username,
        provider_name: sr.uname,
        sid: dt1.id,
        email: dt1.email,
        phoneNumber: dt1.phoneNumber,
        address: dt1.address,
        date: dt1.date,
        time: dt1.time
    });
    let service = await ServiceModel.findById(dt1.id);
    service.bookings.push(booking);
    
    await booking.save();
    await service.save();

    res.render("ConfirmationPage", {data: {id: booking._id, date:dt1.date, username: dt1.username, pro: sr.uname, fee: sr.Fee }})
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
    const { EName,ChargingFee, servicedescription ,noteworthy, username,pet_type,service_type} = req
    const service = new ServiceModel({
        serviceName: EName,
        serviceDescription: servicedescription,
        noteworthy: noteworthy,
        Fee: ChargingFee,
        uname: username,
        service_type:service_type,
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
            
            await PetCareProviderModel.find({ name: { "$regex": req.body.keyword, "$options": "i" } }).then(function (items, err) {
                if (err) console.log(err);
                else {
                    // console.log(items)
                    res.render('services/caretaker-list', { data: items })
                }
            })
        }
        else{
            await PetCareProviderModel.find({}).then(function (items, err) {
                if (err) console.log(err);
                else {
                    // console.log(items);
                    res.render('services/caretaker-list', { data: items })
                }
            })
        }
    }catch(err){
        console.error(err);
            throw err;
    }  
}

    
    

