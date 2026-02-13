const Listing = require("../models/listing.model.js")

module.exports.index = async (req, res) => {
    const list = await Listing.find({})
    // console.log(list);
    res.render("listings/index.ejs", { list })
}
module.exports.getForm = async (req, res) => {
    res.render("listings/new.ejs")
}
module.exports.show = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const item = await Listing.findById(id).
        populate({
            path: "reviews", populate: {
                path: "owner",
            }
        }).
        populate("owner")
    if (item === null) {
        req.flash("error", "no such listing exist!");
        return res.redirect(`/listings`);
    }

    // const reviews = await Review.find({
    //     _id: { $in: item.reviews }
    // });
    res.render("listings/show.ejs", { item })
}
module.exports.createlisting = async (req, res) => {
    let url = req.file.path
    let filename = req.file.filename
    const item = new Listing(req.body.listing)
    // console.log(res.locals.currentUser);
    item.owner = req.user._id;
    item.image = { url, filename }
    await item.save()
    req.flash("success", "new listing created!");
    res.redirect("/listings")

}

module.exports.getEditForm = async (req, res) => {
    const { id } = req.params;
    const item = await Listing.findById(id)
    if (item === null) {
        req.flash("error", "no such listing exist!");
        return res.redirect(`/listings`);
    }
    let originalImageurl=item.image.url;
    console.log(originalImageurl);
    
    originalImageurl=originalImageurl.replace("/upload","/upload/h_100,w_200/")
    res.render("listings/edit.ejs", { item,originalImageurl })
}
module.exports.update = async (req, res) => {
    const { id } = req.params;
    const item = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path
        let filename = req.file.filename
        item.image = { url, filename }
        await item.save();
    }
    // const item = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // if(item===null){
    //      req.flash("error","no such listing exist!");
    //      return  res.redirect(`/listings`);
    // }
    req.flash("success", "listing updated successfully!");
    return res.redirect(`/listings/${id}`);
}

module.exports.deletelisting = async (req, res) => {
    const { id } = req.params;
    const item = await Listing.findByIdAndDelete(id);
    if (item === null) {
        req.flash("error", "no such listing exist!");
        return res.redirect(`/listings`);
    }
    req.flash("success", "listing deleted successfully!");
    res.redirect(`/listings`);
}