if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
const Listing = require("./models/listing.model.js")
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const path = require("path");
const mo = require("method-override")
const ejsMate = require("ejs-mate")
const listingRoute=require("./routes/listing.route.js")
const reviewRoute=require("./routes/review.route.js")
const session=require('express-session')
const MongoStore = require('connect-mongo');
const flash =require('connect-flash');
const  passport  = require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.model.js")
const ExpressError = require("./utils/ExpressError.js");
const userRoute=require("./routes/user.route.js")



// MONGO_URI = "mongodb://127.0.0.1:27017/rentro"
MONGO_URI=process.env.MONGODB_URL
main().then(() => {
    console.log("connected to db");

}).catch(err => {
    console.log(err);

})
async function main() {
    mongoose.connect(MONGO_URI)
}



// async function main() {
//     await mongoose.connect(MONGO_URI, {
//         serverSelectionTimeoutMS: 5000
//     });
// }


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(mo("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

app.get("/", async(req, res) => {
    res.redirect("/listings")
})

const store=MongoStore.create({
    mongoUrl:MONGO_URI,
    crypto: {
    secret: process.env.SECRET
  },
  touchAfter:24*60*60
})
store.on("error",()=>{
    console.log("error occurred in mongo-session",error);
    
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*3600*1000,
        maxAge:7*24*3600*1000,
        httpOnly:true
    }
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})


app.use("/listings",listingRoute)
app.use("/listings/:id/reviews",reviewRoute)
app.use("/",userRoute)


app.use((req, res, next) => {
    next((new ExpressError(404, "page not found")))
})


app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.status(status).render("errors/error.ejs", { err })
    //   throw new ExpressError(status,message)
})

app.listen(8000, (req, res) => {
    console.log("app running on port");
})
