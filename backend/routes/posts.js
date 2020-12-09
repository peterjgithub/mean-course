const express = require("express");
const multer = require("multer");
const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let error = new Error("Invalid mime type")
    const isValid = MIME_TYPE_MAP[file.mimetype];
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images"); //path is relative to server.js
    // cb = callback
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + '.' + ext);
  }
})
// info on malter: see gitHub repo on malter

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
//multer(storage).single("image")
  // multer wil try to find a single file from the request
  // and wil now try to find it on a image property in the request body
//router.post("/api/posts", (req, res, next) => {
//we filter the routes in app.js and only forwared requests on api/posts to this route
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  // post.save(); we should use the Id of the newly created Post
  post.save().then(createdPost => {
   //  console.log(result); we see it contains eg _id: 5fcd74bb8aeec4730c867bd0
    res.status(201).json({
      message: 'Post added succesfully',
      postId: createdPost._id //use in the addPost service
    });
  });
});

// router.path is also an option for updates
router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    // console.log(result);
    res.status(200).json({ message: "Update succesful!"});
  });
});

router.get("/:id", (req,res,next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found'});
    };
  });
});

router.get("", (req, res, next) => {
  // Post.find((err, documents) => {});
  //.find retrieves all Posts (=documents)
  // function will be executed once the find is done
  // but we prefer not to use a callback

  Post.find()
  .then(documents => {
    res.status(200).json({
      message: 'backend/router.js >router.get Post.find() > Posts fetched succesfully',
      posts: documents
    });
  })
  //todo: add catch for error handling
  ;
});

//"api/posts/:id" is a dynamic path with id value
router.delete("/:id", (req,res,next) => {
  //console.log("backend/router.js >router.delete: " + req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: "router.js>router.delete: Post deleted"});
  });
});

module.exports = router;