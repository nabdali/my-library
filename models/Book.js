var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');

var BookSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},
  title: String,
  description: String,
  rate: {type: String, default: "0.0", match: [/^[0-9]\.(0|5)+$/, 'is invalid']},
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', default: null },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

BookSchema.plugin(uniqueValidator, {message: 'is already taken'});

BookSchema.pre('validate', function(next){
  if(!this.slug)  {
    this.slugify();
  }

  next();
});

BookSchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

BookSchema.methods.toJSONFor = function(user){
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    rate: this.rate,
    categorie: this.categorie,
    owner: this.owner.toProfileJSONFor(user)
  };
};

mongoose.model('Book', BookSchema);
