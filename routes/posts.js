var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
  dest:'uploads/'
});
var db = require('monk')('localhost/nodeblog');

/* GET Posts*/
router.get('/add', function(req, res, next) {

  var categories = db.get('categories');
  categories.find({},{},function(err, category){
    console.log(category);
    res.render('addpost',{
      title:'Add Post',
      categories:category
    });
  });
});

router.post('/add', upload.single('mainimage'), function(req,res,next){
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();
  
  if(req.file){
    var mainimage = req.file.filename;
  }
  else {
    var mainimage = "noimage.jpg";
  }

  req.checkBody('title', 'Title Feild is required').notEmpty();
  req.checkBody('body', 'Body Feild is required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.render('addpost',{
      errors:errors
    });
  } else{
    var posts = db.get('posts');
    posts.insert({
      title:title,
      body:body,
      category:category,
      date:date,
      author:author,
      mainimage:mainimage
    }, function(err, post){
      if(err) 
        res.send(err);
        else{
          req.flash('success','Post Added');
          res.redirect('/');
        }
    });
  }
});

module.exports = router;
