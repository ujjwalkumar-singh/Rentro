const express=require("express")
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { validateReview ,isLoggedIn, isAllowed,isReviewAuthor} = require("../middleware/authMiddleware.js")
const {createReview,deleteReview}=require("../controllers/review.controller.js")



//Create route for Review
router.post("/",isLoggedIn, validateReview, wrapAsync(createReview))


//delete route for reviews
router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(deleteReview))


module.exports = router;