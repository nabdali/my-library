var router = require('express').Router();
var mongoose = require('mongoose');
var Categorie = mongoose.model('Categorie');
var auth = require('../auth');

// Preload user categorie on routes with ':id'
router.param('slug', function(req, res, next, slug){
    Categorie.findOne({slug}).then(function(categorie) {
    if (!categorie) { return res.sendStatus(404); }

    req.categorie = categorie;

    return next();
  }).catch(next);
});

router.get('/', auth.optional, function(req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
  }

  if( typeof req.query.tag !== 'undefined' ){
    query.tagList = {"$in" : [req.query.tag]};
  }

  Promise.all([
      Categorie.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({createdAt: 'desc'})
        .exec(),
        Categorie.count(query).exec()
  ]).then(function(results){
    var categories = results[0];
    var categoriesCount = results[1];

    return res.json({
      result: categories,
      booksCount: categoriesCount
    });
  }).catch(next);
});

router.get('/:slug', auth.optional, function(req, res, next){
    return res.json({result: req.categorie});
});

router.post('/', auth.required, function(req, res, next) {
      var categorie = new Categorie(req.body.categorie);
  
      return categorie.save().then(function(){
        console.log(categorie.name);
        return res.json({categorie: categorie});
      });
});

module.exports = router;
