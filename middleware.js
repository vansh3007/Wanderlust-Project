const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utility/ExpressError.js");
const { ListingSchema, reviewSchema } = require("./schema.js"); 

module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You Must Be Logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
  next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (
      !res.locals.currUser._id.equals(listing.owner._id)
    ) {
      req.flash("error", "You are not permitted !");
      return res.redirect(`/listing/${id}`);
    };
    next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    console.log(error);
    let errMsg = error.details.map((el) => el.message.join(","));
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!res.locals.currUser._id.equals(review.author._id)) {
    req.flash("error", "You are not permitted !");
    return res.redirect(`/listing/${id}`);
  }
  next();
};