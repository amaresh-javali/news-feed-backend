// feed.model.js
const { Schema, model } = require('mongoose');

const newsSchema = new Schema({
  title: String,
  description: String,
  link: String,
  // Define category as a reference to the Category model
  category: { type: Schema.Types.ObjectId, ref: "Category" }, // Remove default value
  pubDate: { type: Date, default: Date.now } // Corrected pubDate type
}, { timestamps: true });

const Feed = model("Feed", newsSchema);

module.exports = Feed;
