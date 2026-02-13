const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.model.js")
const User=require("./user.model.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url:String,
        filename:String
    },
    category:{
        type:String,
        enum:["trending","rooms","cities","amazingpools","beach","mountains","city","nativeBuffer","luxury",
           " family","pet"],
           required:true
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;