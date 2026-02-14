const User=require("../models/user.model.js")
const passport=require("passport")
const { saveRediectUrl } = require("../middleware/authMiddleware.js")

module.exports.getSignupForm=(req,res)=>{
    res.render("user/signup.ejs")
}

module.exports.signup=async (req,res)=>{
 try {
     let {username,email,password}=req.body;
     const newUser=new User({email,username})
     const registeredUser=await User.register(newUser,password)
    //  console.log(registeredUser);
     req.login(registeredUser,(err)=>{
         if(err){
            return next(err)
         }
         req.flash("success","new user createed")
          res.redirect("/listings")
     })
 } catch (error) {
    req.flash("error",error.message)
    res.redirect("/signup")
 }
}
module.exports.getLoginForm=(req,res)=>{
    res.render("user/login.ejs")
}
module.exports.login=async (req,res)=>{
   req.flash("success","welcome to website")
   let url=res.locals.redirectUrl||"/listings"
   res.redirect(url)

}
module.exports.logout=(req,res)=>{
    req.logout((error)=>{
        if(error){
            return next(error)
        }
        req.flash("success","loggedout Successfully!!")
        res.redirect("/listings")
    })
}