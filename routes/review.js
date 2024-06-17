const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utility/wrapAsync");
const reviewController = require("../controllers/review.js");
const { validateReview, isloggedin, isReviewAuthor } = require("../middleware.js");

router
  .route("/")
  .get(wrapAsync(reviewController.reviewForm))
  .post(isloggedin, validateReview, wrapAsync(reviewController.newReview));

router.delete(
  "/:reviewId",
  isloggedin,
  isReviewAuthor,
  wrapAsync(reviewController.delete)
);

module.exports = router;