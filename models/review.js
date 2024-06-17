const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    content: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    date: {
        type: Date,
        default: Date.now()
    }
}
);
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;