const express = require ('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session  = require('express-session')
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const emailService = require('./emailService/emailService');

const { saveOwner, saveProvider, saveBooking,saveService,getServiceData,updateOtp ,getCaretakerData,verifyProvider} = require('./models/utility');
const { petOwner,petCareProvider,booking,service } = require('./models/schemas');

const PetOwnerModel = mongoose.model("PetOwner", petOwner);
const PetCareProviderModel = mongoose.model("PetCareProvider", petCareProvider);
const BookingModel = mongoose.model("Booking", booking);
const ServiceModel = mongoose.model("Service", service);

const MongoStore = require('connect-mongo');
const app = express();

//const dbUrl = 'mongodb://127.0.0.1/pawsitively';
const dbUrl = process.env.Database || 'mongodb://localhost:27017/pawsitively';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", ()=>{
    console.log("Database Connected");
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))
 
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_',
}))

const secret = 'thisisasecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    crypto: {
        secret,
    },
});

store.on('error', function(e){
    console.log("Session Store Error ", e);
})

const sessionConfig = {
    store,
    name: 'newSession',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
} 
app.use(session(sessionConfig))
app.use(flash());

app.use((req,res,next)=>{
    res.locals.currentUser = req.session.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get("/", (req,res)=>{
    res.render('index');
})

app.get("/login", (req,res)=>{
    res.render('user/login');
})

app.post("/login", async(req,res)=>{
    let {username, password} = req.body;
    
    await PetOwnerModel.find({ uname: username }).then(function (items, err) {
        if (err) console.log(err);
        else {
            if (items.length == 0) {
                PetCareProviderModel.find({ uname: username }).then(function (items, err) {
                    if (err) console.log(err);
                    else {
                        if (items.length == 0) {
                            req.flash('error', 'User not found');
                            res.redirect('/login')
                        }
                        else {
                            if(items[0].password == password){
                                req.session.user = {
                                    username: username,
                                    usertype: "provider"
                                }
                                res.redirect('/');
                            }
                            else{
                                req.flash('error', 'Invalid Password!');
                                console.log("Invalid Password!");
                                res.redirect("/login");
                            }

                        }
                    }
                })
            }
            else {
                if (items[0].password == password) {
                    req.session.user = {
                        username: username,
                        usertype: "owner"
                    }
                    res.redirect('/');
                }
                else {
                    req.flash('error', 'Invalid Password!');
                    console.log("Invalid Password!");
                    res.redirect("/login");
                }
            }
        }
    })

    
})

app.get('/logout', (req,res)=>{
    try{
        req.flash('success','Logged Out!!')
        req.session.destroy()
        res.redirect('/')
    }catch(e){
        console.log(e)
    }
})

app.get("/register", (req,res)=>{
    res.render('user/register');
})

app.post('/register', (req,res)=>{
    const {typeOfUser} = req.body;
    if(typeOfUser == "pet"){
        res.redirect("/RegisterOwner")
    }else{
        res.redirect("/RegisterCaretaker")
    }
})

app.get("/RegisterOwner", (req,res)=>{
    res.render('user/RegisterOwner');
})

app.post("/RegisterOwner", async (req,res)=>{
    const {username} = req.body;
    await PetOwnerModel.find({ uname: username }).then(function (items, err) {
        if (err) console.log(err);
        else {
            if (items.length != 0) {
                console.log("User already registered");
            }
            else {
                PetCareProviderModel.find({ uname: username }).then(function (items, err) {
                    if (err) console.log(err);
                    else {
                        if (items.length != 0) {
                            alert("User already registered");
                        }
                        else {
                            saveOwner(req);
                            const { username } = req.body
                            req.session.user = {
                                username: username,
                                usertype: "owner"
                            }
                            res.redirect('/');
                        }
                    }
                })
            }
        }
    })
    
})

app.get("/RegisterCaretaker", (req,res)=>{
    res.render('user/RegisterCaretaker');
})

app.post("/RegisterCaretaker", async (req,res)=>{
    const { username } = req.body;
    await PetOwnerModel.find({ uname: username }).then(function (items, err) {
        if (err) console.log(err);
        else {
            if (items.length != 0) {
                console.log("User already registered");
            }
            else {
                PetCareProviderModel.find({ uname: username }).then(function (items, err) {
                    if (err) console.log(err);
                    else {
                        if (items.length != 0) {
                            alert("User already registered");
                        }
                        else {
                            saveProvider(req);
                            const { username } = req.body
                            req.session.user = {
                                username: username,
                                usertype: "provider"
                            }
                            res.redirect('/');
                        }
                    }
                })
            }
        }
    })
})

app.get('/service-categories', (req,res)=>{
    res.render('services/category')
})

app.get('/services',async (req,res)=>{
    getServiceData(req,res);
})

app.post('/services', async(req, res)=>{
    getServiceData(req, res);
})

app.get('/service/:keyword', async(req,res)=>{
    getServiceData(req,res);
})

app.get('/services/:id', async(req,res)=>{
    const { id } = req.params
    const dt1 = await ServiceModel.findById(id);
    dt1["sid"] = id;
    res.render('services/service-detail',{dt1:dt1})
})


app.post('/services/:id', async (req, res) => {
    const dt1 = req.body;
    dt1["id"] = req.params.id
    dt1["username"] = req.session.user.username;
    await saveBooking(dt1,res);
})

app.get('/caretakers', (req,res)=>{
    getCaretakerData(req, res)
})

app.get("/caretakers/:id", async(req,res)=>{
    const { id } = req.params
    const provider = await PetCareProviderModel.findById(id)
    const data1 = await ServiceModel.find({ _id: provider.services})
    const data = {provider, data1}
    res.render('user/CaretakerProfile', { data });
})

app.post("/caretakers", (req, res) => {
    getCaretakerData(req, res)
})

app.get("/addservice", (req, res) => {
    res.render('services/addservice');
})

app.get("/getOtp/:id", async(req,res)=>{
    const {id} = req.params
    const provider = await PetCareProviderModel.findById(id)
    emailService(provider.email, provider.uname,'provider');
})


app.post("/verifyuser/:username", async(req,res)=>{
    const { username } = req.params
    const { otp } = req.body;
    if(otp == null ){
        res.send("OTP cannot be null")
    }
    let dt1 = {}
    dt1["username"] = username;
    dt1["otp"] = otp;
    verifyProvider(dt1);
    res.redirect('/caretakers')
})

app.post("/addservice", async (req,res)=>{
    let dt1 = req.body;
    dt1["username"] = req.session.user.username;
    dt1["usertype"] = req.session.user.usertype;
    saveService(dt1, res);
})

app.get("/Confirmation", (req,res)=>{
    res.render('ConfirmationPage');
})
app.get("/goals", (req,res)=>{
    res.render('goals');
})
app.get("/serviceBook", (req,res)=>{
    res.render('user/serviceBook');
})
app.get('*', (req,res)=>{
    res.render('404');
})

const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log(`SERVING ON 3000`);
})