const Review = require("../models/review.model.js")
const Listing = require("../models/listing.model.js")

module.exports.createReview=async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id)
    let newReview = new Review(req.body.review);
    newReview.owner=req.user._id;
    // console.log(newReview);
    let savedReview = await newReview.save();
    const savedId = savedReview._id;
    list.reviews.push(savedId);
    const updatedList = await list.save();
     req.flash("success","Review added successfuly!");
    return res.redirect(`/listings/${id}`);
}

module.exports.deleteReview=async (req, res) => {
    let {id,reviewid}=req.params;
    //USE OF PULL OPERATOR OF MONGOOSE
    await Listing.findByIdAndUpdate(id,{
        $pull:{reviews:reviewid}
    })
    await Review.findByIdAndDelete(reviewid);
     req.flash("success","Review deleted successfuly!!");
    res.redirect(`/listings/${id}`)
}