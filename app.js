const express = require ('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session  = require('express-session')
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { saveOwner, saveProvider, saveBooking } = require('./models/utility');
const { petOwner,petCareProvider,booking } = require('./models/schemas');

const PetOwnerModel = mongoose.model("PetOwner", petOwner);
const PetCareProviderModel = mongoose.model("PetCareProvider", petCareProvider);
const BookingModel = mongoose.model("Booking", booking);

const MongoStore = require('connect-mongo');
const app = express();

const dbUrl = 'mongodb://localhost:27017/pawsitively';
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

app.post("/login", (req,res)=>{
    let {username, password} = req.body;
    PetOwnerModel.find({ uname: username, password:password }).then(function (items, err) {
        if (err) console.log(err);
        else {
            if (items.length == 0) {
                req.flash('error', 'Invalid Password');
                res.redirect('/login')
            }
            else {
                req.session.user = {
                    username: username
                }
                res.redirect('/');
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
    saveOwner(req);
    res.redirect('/');
})

app.get("/RegisterCaretaker", (req,res)=>{
    res.render('user/RegisterCaretaker');
})

app.post("/RegisterCaretaker", (req,res)=>{
    res.send(req.body)
})

app.get('/service-categories', (req,res)=>{
    res.render('services/category')
})

app.get('/services-list', (req,res)=>{
    res.render('services/service-list')
})

app.get('/service-detail', (req,res)=>{
    res.render('services/service-detail')
})

app.get('/caretaker-list', (req,res)=>{
    res.render('services/caretaker-list')
})
app.get("/CaretakerProfile", (req,res)=>{
    res.render('user/CaretakerProfile');
})
app.get("/goals", (req,res)=>{
    res.render('goals');
})
app.get('*', (req,res)=>{
    res.render('404');
})

app.listen(3000, ()=>{
    console.log(`SERVING ON 3000`);
})