const express = require("express");
const app = express();
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3.js")
const {s3Url} = require("./config.json");

app.use(express.static("./public"));

app.use(express.json());

const diskStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function (req, file, callback) {
    uidSafe(24).then(function (uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  },
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152,
  },
});


//Retreive images

app.get("/images", (req, res) => {
    db.getImages().then(result => {
        res.json(result);
    })
});


//get image ID
app.get("/images/" + this.id, (req, res) => {    
    const {id} = req.params;
    db.getImageById(id).then(result => {
        res.json(result);
        console.log("result", result);
    })
});

//store and upload image data

app.post("/upload", uploader.single('file'), s3.upload, (req, res) => {
    console.log(req.body, req.file);
    const {username, title, desc} = req.body;
    const filename = req.file.filename;
    db.uploadImage(s3Url + filename, username, title, desc).then((result) => {
        console.log("result", result);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
});



//app.post("/upload", uploader.single("file"), function (request, response) {
  //console.log(request.body, request.file);
  //if (request.file) {
    //console.log("it worked");
    //it worked
  //} else {
    //it failed
    //console.log("it failed");
  //}
///});

app.listen(8080, () => console.log("I'm listening"));