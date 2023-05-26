const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/SDC');

const db = mongoose.connection;

const ReviewedProduct = new mongoose.Schema ({

  product_id: Number,
  review_id: Number,
  rating: Number,
  summary: String,
  recommended: Boolean,
  response: String,
  body: String,
  date: Date,
  reviewer_name: String,
  helpfulness: Number,
  Photos: {id: Number, url: String},
  reported: Boolean,
  Size: Number,
  Width: Number,
  Comfort: Number,
  Quality: Number,
  Length: Number,
  Fit: Number

  });