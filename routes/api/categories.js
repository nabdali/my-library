var router = require('express').Router();
var mongoose = require('mongoose');
var Categorie = mongoose.model('Categorie');
var auth = require('../auth');

// Preload user categorie on routes with ':id'
router.param('id', function(req, res, next, id){
    Categorie.findOne({_id: id}).then(function(categorie) {
    if (!categorie) { return res.sendStatus(404); }

    req.categorie = categorie;

    return next();
  }).catch(next);
});

router.get('/:id', auth.optional, function(req, res, next){
    return res.json({categorie: req.categorie});
});

router.post('/', auth.required, function(req, res, next) {
      var categorie = new Categorie(req.body.categorie);
  
      return categorie.save().then(function(){
        console.log(categorie.name);
        return res.json({categorie: categorie});
      });
});

module.exports = router;
