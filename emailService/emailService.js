const nodemailer = require('nodemailer');
const getOTP = require('./generateOtpSevice');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/pawsitively");
const { saveOwner, saveProvider, saveBooking,saveService,getServiceData,updateOtp } = require('../models/utility');
const { petOwner,petCareProvider,booking,service} = require('../models/schemas');

const PetOwnerModel = mongoose.model("PetOwner", petOwner);
const PetCareProviderModel = mongoose.model("PetCareProvider", petCareProvider);


const emailService = async(sendTo,username,Utype) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "pawsitivelyperfect38@gmail.com",
            pass: "vczw wfqi dped fkuo"

        }
    });
    const otp = getOTP();
    let dt1 = {}
    dt1["username"] = username;
    dt1["otp"] = otp;
    dt1["Utype"]=Utype;
    updateOtp(dt1);
    const mailOptions = {
        from: "ngointerconnect2022@gmail.com",
        to: sendTo,
        subject: "email verfiyusing OTP",
        html:"<h1> Your OTP is:" + otp + "</h1>"
    };
    transporter.sendMail(mailOptions, (error, info) =>{
        if(error){
            console.log(error);
        }
        else{
            console.log("email sent: " + info.response);
        }
    });
};

module.exports = emailService;