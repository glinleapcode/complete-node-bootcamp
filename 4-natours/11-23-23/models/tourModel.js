const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name!'],
    unique: true,
    trim: true,
    maxLength: [40, 'A tour name must have less or equal to 40 characters'],
    minLength: [10, 'A tour name must have more or equal than 10 characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'rating must be above 1.0'],
    max: [5, 'rating must be below 5.0']
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },

  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },

  priceDiscount: {
    type: Number
    //required: [false]
  },

  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false // hide this field from the output
  },
  startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
