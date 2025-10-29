const express = require("express")
const router=express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js")
const passport=require("passport")
const { saveRediectUrl } = require("../middleware/authMiddleware.js")
const {getSignupForm,signup,getLoginForm,login,logout}=require("../controllers/user.controller.js")


router.route("/signup")
.get(getSignupForm)
.post(wrapAsync(signup))


router.route("/login")
.get(getLoginForm)
.post(
    saveRediectUrl,
    passport.authenticate("local",{
    failureRedirect:'/login',
    failureFlash:true})
    ,
   login)

//LogOut user route
router.get("/logout",logout)


module.exports=router;