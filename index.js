const express = require("express");
const app = express();
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

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

app.get("/images", (request, response) => {
  db.getImages()
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/upload", uploader.single("file"), function (request, response) {
  console.log(request.body, request.file);
  if (request.file) {
    console.log("it worked");
    //it worked
  } else {
    //it failed
    console.log("it failed");
  }
});

app.listen(8080, () => console.log("I'm listening"));