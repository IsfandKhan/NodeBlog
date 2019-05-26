var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
  dest:'uploads/'
});
var monk = require('monk');
var db = monk('localhost/nodeblog');

/* GET Posts*/
router.get('/show/:id', function(req,res){
  var posts = db.get('posts');
  posts.findOne({_id: monk.id(req.params.id)},{}, function(err, post){
    console.log(post);
    res.render('show',{
      'post': post
    });
  });
});

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
  var mainimage;
  
  if(req.file){
    mainimage = req.file.filename;
  }
  else {
    mainimage = "noimage.jpg";
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

router.post('/addcomment', function(req,res){
  var name = req.body.name;
  var email = req.body.email;
  var body = req.body.body;
  var date = new Date();
  var postid = req.body.postid;

  var comment = {
    name:name,
    email:email,
    body:body,
    commentdate:date 
  };

  var posts = db.get('posts');

  posts.update({
    "_id":postid
  },{
    $push:{
      "comments":comment
    }
  }, function(err, doc){
    if(err) throw err;
    else{
      req.flash('success', 'Comment Added');
      res.redirect('/posts/show/'+postid);
    }
  });
});

module.exports = router;