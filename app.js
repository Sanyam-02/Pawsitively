const express = require ('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session  = require('express-session')
const flash = require('connect-flash');
// const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const userRoutes = require('./routes/users')
// const campgroundRoutes = require('./routes/campground');
// const reviewRoutes = require('./routes/review');

const MongoStore = require('connect-mongo');
const app = express();

// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// mongoose.connect(dbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once("open", ()=>{
//     console.log("Database Connected");
// });

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))
 
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_',
}))

const secret = process.env.SECRET || 'thisisasecret';

// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     touchAfter: 24 * 3600,
//     crypto: {
//         secret,
//     },
// });

// store.on('error', function(e){
//     console.log("Session Store Error ", e);
// })

// const sessionConfig = {
//     store,
//     name: 'newSession',
//     secret,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         // secure:
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// } 
// app.use(session(sessionConfig))
app.use(flash());

app.get("/", (req,res)=>{
    res.render('index');
})
app.get("/index", (req,res)=>{
    res.render('index');
})

app.get("/login", (req,res)=>{
    res.render('loginpage');
})

app.get("/register", (req,res)=>{
    res.render('register');
})

app.get("/caretakerregister", (req,res)=>{
    res.render('careredister');
})

// app.get("/Register", (req,res)=>{
//     res.render('register');
// })

app.get('*', (req,res)=>{
    res.render('404');
})

app.listen(3000, ()=>{
    console.log(`SERVING ON 3000`);
})