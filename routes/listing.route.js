const express=require("express")
const router = express.Router();
const Listing = require("../models/listing.model.js")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {isLoggedIn,validateListing,isAllowed} = require("../middleware/authMiddleware.js")
const {index,getForm,show,createlisting,getEditForm,update,deletelisting}=require("../controllers/listing.controller.js")
const multer  = require('multer')
const {storage} =require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
.get( wrapAsync(index))
.post(  isLoggedIn,
     upload.single('listing[image]'),
     validateListing,
     wrapAsync(createlisting))


//NEW ROUTE FOR GETTING FORM
router.get("/new",isLoggedIn, wrapAsync(getForm))

//SHOW ROUTE
router.route("/:id")
.get( wrapAsync(show))
.put( isLoggedIn,isAllowed, upload.single('listing[image]'),validateListing,wrapAsync(update))
.delete( isLoggedIn,isAllowed,wrapAsync(deletelisting))

router.get("/:id/edit",isLoggedIn,isAllowed, wrapAsync(getEditForm))

module.exports = router;