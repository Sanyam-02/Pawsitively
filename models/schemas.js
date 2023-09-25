

// Creating a mongoose collection Schema
export const petOwner = new mongoose.Schema({
    uname: String,
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

export const petCareProvider = new mongoose.Schema({
    uname: String,
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

export const booking = new mongoose.Schema({
    uname: String,
    provider_name: String,
    schedule: Date,
    agenda: String
});




