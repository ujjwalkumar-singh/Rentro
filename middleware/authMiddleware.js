const Listing=require("../models/listing.model")
const Review=require("../models/review.model.js")
const { listingSchema} = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema.js")


module.exports.isLoggedIn = (req,res,next)=>{
   if(!req.isAuthenticated()){
      //   req.session.redirectUrl=req.originalUrl;
      //   req.flash("error","you need to logged in first");
      //   return res.redirect("/login")
      //   if (req.method === "GET") {
      //      req.session.redirectUrl = req.originalUrl;
      //   } else if (req.get("Referrer")) {
      //      req.session.redirectUrl = req.get("Referrer");
      //   } else if (req.params && req.params.id) {
      //      req.session.redirectUrl = `/listings/${req.params.id}`;
      //   } else {
      //      req.session.redirectUrl = "/listings";
      //   }
      if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        } else if (req.params && req.params.id) {
            req.session.redirectUrl = `/listings/${req.params.id}`;
        } else {
            req.session.redirectUrl = "/listings";
        }

        req.flash("error","you need to logged in first");
        return res.redirect("/login")
   }
   
   next()
}

module.exports.saveRediectUrl = (req,res,next)=>{
   if(req.session.redirectUrl){
       res.locals.redirectUrl=req.session.redirectUrl;
      delete req.session.redirectUrl;
   }
   next()
}
module.exports.isAllowed=async(req,res,next)=>{
   const { id } = req.params;
    const target= await Listing.findById(id);
    if(!target){
         req.flash("error","no such post exist!");
         return res.redirect("/listings")
    }
    if(!(req.user && req.user._id.equals(target.owner._id))){
         req.flash("error","you are not author of this post!");
         return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isReviewAuthor=async(req,res,next)=>{
   const {reviewid,id } = req.params;
   console.log(req.params);
   
    const target= await Review.findById(reviewid);
    if(!target){
         req.flash("error","no such review exist!");
         return res.redirect("/listings")
    }
    if(!(req.user && req.user._id.equals(target.owner._id))){
         req.flash("error","you are not author of the review!");
         return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    if (!req.body || !req.body.listing) {
        throw new ExpressError(400, "Listing is required smje ki nhi");
    }
    const { value, error } = listingSchema.validate(req.body);
    console.log(error);
    if (error) {
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    if (!req.body || !req.body.review) {
        throw new ExpressError(400, "Review is required");
    }
    const { value, error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
}