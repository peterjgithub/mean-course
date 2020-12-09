const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require ("mongoose");
const cors = require('cors')

const postRoutes = require("./routes/posts");

const app = express();

// !!!!!!! very important as we host the node.js and angular on the same page :
// never use the same routes for node that are used in angular
// like /create
mongoose.connect(
  "mongodb+srv://max:2h2JQUsrtrD5rWGU@cluster0.gwtmm.mongodb.net/db4node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log('******** Connected to database ********')
  })
  .catch( () => {
    console.log('!!!!! Connection failed !!!!!! ')
  });

app.use(bodyParser.json());
// this will return a valid expess middleware for parsing json data

// there is also a url encoder to parse url-encoded data
//app.use(bodyParser.urlencoded({extended: false}));

app.use('*', cors());
//consider npm install cors
//https://expressjs.com/en/resources/middleware/cors.html
/* app.use((req, res, next)=> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  if (req.method === 'DELETE') {
    res.status(200);
  }
  next();
}); */
//    "GET, POST, OPTIONS, PUT, DELETE, PATCH"

app.use("/api/posts", postRoutes);

module.exports = app;