const mongoose = require('mongoose');
const slugify = require('slugify');
const HomeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters'],
  },
  slug: String,
  neighbourhood: {
    type: String,
    required: [true, 'Please add a neighbourhood'],
    maxlength: [50, 'Neighbourhood can not be more than 50 characters'],
  },
  room_type: {
    type: String,
    required: [true, 'Please add a room_type'],
    maxlength: [50, 'Room type can not be more than 50 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please add price'],
  },
  days_available: {
    type: Number,
    required: [true, 'Please add number of days available'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Creating Home name slug from name
HomeSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Home', HomeSchema);
