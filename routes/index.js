var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/nodeblog');

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var post = db.get('posts');
  post.find({},{},function(err, posts){
    res.render('index', { posts: posts });
  });
});

module.exports = router;
