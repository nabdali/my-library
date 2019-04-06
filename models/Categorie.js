var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');

var CategorieSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},
  name: String
}, {timestamps: true});

CategorieSchema.plugin(uniqueValidator, {message: 'is already taken'});

CategorieSchema.pre('validate', function(next){
  if(!this.slug)  {
    this.slugify();
  }

  next();
});

CategorieSchema.methods.slugify = function() {
  this.slug = slug(this.name);
};

mongoose.model('Categorie', CategorieSchema);
