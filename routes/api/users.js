var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');
var nodemailer = require('nodemailer');

router.get('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    return res.json({result: user.toAuthJSON()});
  }).catch(next);
});

router.put('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(typeof req.body.user.username !== 'undefined'){
      user.username = req.body.user.username;
    }
    if(typeof req.body.user.email !== 'undefined'){
      user.email = req.body.user.email;
    }
    if(typeof req.body.user.bio !== 'undefined'){
      user.bio = req.body.user.bio;
    }
    if(typeof req.body.user.image !== 'undefined'){
      user.image = req.body.user.image;
    }
    if(typeof req.body.user.password !== 'undefined'){
      user.setPassword(req.body.user.password);
    }

    return user.save().then(function(){
      return res.json({result: user.toAuthJSON()});
    });
  }).catch(next);
});

router.post('/users/login', function(req, res, next){
  if(!req.body.user.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      return res.json({result: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.post('/users', function(req, res, next){
  var user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user.save().then(function(){
    return res.json({result: user.toAuthJSON()});
  }).catch(next);
});

router.post('/send', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401);}
    const to = req.body.to;

    let smtpTransport = nodemailer.createTransport({
      host: process.env.SMPT_SERVER,
      port: 587,
      secure: false,
      auth: {
          user: process.env.EMAIL, 
          pass: process.env.EMAIL_MDP  
      }
    });
  
    let mail = {
    from: '"My book" <my@otakutech.ovh>', 
    to: to, 
    subject: user.username + "vous conseille un livre", 
    text: req.body.book,
    html: ''
    };

    smtpTransport.sendMail(mail, function(error, response){
      if(error){
          console.error("Error while try to sent mail", new Date());
          console.log(error);
      }else{
          console.log("Mail sent succesfull", new Date())
      }
      smtpTransport.close();
    });

  });
  

  user.save().then(function(){
    return res.json({result: user.toAuthJSON()});
  }).catch(next);
});

module.exports = router;
