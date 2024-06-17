const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.reviewForm = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  res.render("listing/review.ejs", { list });
};

module.exports.newReview = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  list.reviews.push(newReview);
  await list.save();
  await newReview.save();
  req.flash("success", "New Review Created");
  res.redirect(`/listing/${id}`);
};

module.exports.delete = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listing/${id}`);
};
