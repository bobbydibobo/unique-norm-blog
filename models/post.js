/*-------------------------------
BIND MONGOOSE
-------------------------------*/
const mongoose = require('mongoose');

/*-------------------------------
BIND SLUGIFY
-------------------------------*/
const slugify = require('slugify');

/*-------------------------------
BUILDING MY POSTSCHEMA
-------------------------------*/
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  teaser: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    required: true
  },
  process: {
    type: String,
    required: true
  },
  outcome: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
});

/*-------------------------------
SLUGIF> MY URL
-------------------------------*/
postSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

module.exports = mongoose.model('Post', postSchema);