var router = require('express').Router();
var mongoose = require('mongoose');
var Book = mongoose.model('Book');
var Categorie = mongoose.model('Categorie');
var User = mongoose.model('User');
var auth = require('../auth');

// Preload book objects on routes with ':book'
router.param('slug', function(req, res, next, slug) {
    Book.findOne({slug})
    .populate('owner')
    .populate('categorie')
    .then(function (book) {
      if (!book) { return res.sendStatus(404); }

      req.book = book;

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
    req.query.owner ? User.findOne({username: req.query.owner}) : null
  ]).then(function(results){
    var owner = results[0];

    if(owner){
      query.owner = owner._id;
    }

    return Promise.all([
      Book.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({createdAt: 'desc'})
        .populate('owner')
        .populate('categorie')
        .exec(),
      Book.count(query).exec(),
      req.payload ? User.findById(req.payload.id) : null,
    ]).then(function(results){
      var books = results[0];
      var booksCount = results[1];
      var user = results[2];

      return res.json({
        result: books.map(function(book){
          return book.toJSONFor(user);
        }),
        booksCount: booksCount
      });
    });
  }).catch(next);
});

router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var book = new Book(req.body.book);

    book.owner = user;

    return book.save().then(function(){
      console.log(book.owner);
      return res.json({result: book.toJSONFor(user)});
    });
  }).catch(next);
});

// return a book
router.get('/:slug', auth.optional, function(req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null
  ]).then(function(results){
    var user = results[0];

    return res.json({result: req.book.toJSONFor(user)});
  }).catch(next);
});

// update book
router.put('/:slug', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.book.owner._id.toString() === req.payload.id.toString()){
      if(typeof req.body.book.title !== 'undefined'){
        req.book.title = req.body.book.title;
      }

      if(typeof req.body.book.description !== 'undefined'){
        req.book.description = req.body.book.description;
      }

      if(typeof req.body.book.categorie !== 'undefined'){
        Categorie.findById(req.body.book.categorie).then(function(categorie) {
          req.book.categorie = categorie._id;
        })
      }

      req.book.save().then(function(book){
        return res.json({result: book.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete book
router.delete('/:slug', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    if(req.book.owner._id.toString() === req.payload._id.toString()){
      return req.book.remove().then(function(){
        return res.sendStatus(204);
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

module.exports = router;
