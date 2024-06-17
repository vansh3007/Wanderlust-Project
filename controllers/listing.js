const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.getIndex = async (req, res) => {
  const listing = await Listing.find({});
  res.render("listing/index.ejs", { listing });
};

module.exports.getNew = async (req, res) => {
    res.render("listing/new.ejs");
};

module.exports.getEdit= async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing you requested , Doesn't exist!");
    res.redirect("/listing");
  }

  let originalImageURL = list.image.url;
  originalImageURL = originalImageURL.replace("upload", "upload/h_250,w_300");
  res.render("listing/edit.ejs", { list, id,originalImageURL });
};

module.exports.getShow = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!list) {
    req.flash("error", "Listing you requested , Doesn't exist!");
    res.redirect("/listing");
  };
  res.render("listing/show.ejs", { list });
};

module.exports.postNew = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 2,
    })
    .send();
  const newList = new Listing(req.body.listing);
  if (req.file.path) {
    const url = req.file.path;
    const pathname = req.file.filename;
    newList.image = { url, pathname };
  };
  newList.owner = req.user._id;
  newList.geometry = response.body.features[0].geometry;
  await newList.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listing");
};

module.exports.putEdit = async (req, res) => {
  const { id } = req.params;
  let newList = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    const  url = req.file.path;
    const pathname = req.file.pathname;
    newList.image = { url, pathname };
    await newList.save();
  }
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
};

module.exports.delete = async(req, res)=> {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
}

module.exports.getFilter = async (req, res) => {
  let { q } = req.query;
  if(q=="All"){
    let listing = await Listing.find({});
    res.render("listing/index.ejs", {listing: listing });
  }
  let filteredListing = await Listing.find({ category: q });
   res.render("listing/index.ejs", {listing: filteredListing });
}

module.exports.getSearch = async (req, res) => {
  let { searchCountry } = req.params;
  let listing = await Listing.find({ country: searchCountry });
  res.render("listing/index.ejs", { listing: listing });
};