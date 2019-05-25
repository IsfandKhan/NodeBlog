var express = require('express');
var router = express.Router();

var db = require('monk')('localhost/nodeblog');

/* GET Posts*/
router.get('/add', function(req, res, next) {
    var categories = db.get('categories');
    categories.find({},{},function(err, category){
        res.render('addcategory',{
          title:'Add Category',
          categories:category
        });
    });
});

router.get('/show/:category',function(req, res){
    posts = db.get('posts');

    posts.find({category:req.params.category},{},function(err, post){
        if(err) throw err;

        res.render('index', {
            title:req.params.category,
            posts:post
        });
    });
});


router.post('/add', function(req,res,next){
    var name = req.body.name;

    var categories = db.get('categories');

    categories.insert({
        name:name
    }, function(err, category){
        if(err){
            req.flash('error', 'Category Not Added'); 
            throw err;
        }     

        if(category){
            req.flash('success','Category Added');
            res.redirect('/');
        }
    });
});

module.exports = router;
