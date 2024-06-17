const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utility/wrapAsync");
const { isloggedin, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
  const id = req.params.id;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }
  next();
}

router.get("/filter",listingController.getFilter);
router.get("/search/:searchCountry", listingController.getSearch);

router
  .route("/")
  .get(wrapAsync(listingController.getIndex))
  .post(
    isloggedin,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.postNew)
  );

// New page
router.get("/new", isloggedin, wrapAsync(listingController.getNew));

// Edit
router.get(
  "/:id/edit",
  isloggedin,
  isOwner,
  validateObjectId,
  wrapAsync(listingController.getEdit)
);

router
  .route("/:id")
  .all(validateObjectId) // Apply validateObjectId middleware to all routes with :id
  .get(wrapAsync(listingController.getShow))
  .put(
    isloggedin,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.putEdit)
  )
  .delete(isloggedin, isOwner, wrapAsync(listingController.delete));

module.exports = router;
