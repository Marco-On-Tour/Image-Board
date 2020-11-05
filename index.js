const express = require("express");
const app = express();
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const fs = require("fs");
const db = require("./db.js");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/public/uploads");
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

app.post("/upload", uploader.single("file"), function (req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        const filename = req.file.filename;
        const { desc, username, title } = req.body;
        db.insertImage({
            url: "http://localhost:8080/uploads/" + filename,
            username,
            title,
            desc,
        })
            .then(() =>
                res.json({
                    success: true,
                })
            )
            .catch(() => res.status(500));
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/images", (req, resp) => {
    return db.loadImages().then((images) => resp.json(images));
});

app.use(express.static("./public"));

app.use(express.json());

app.listen(8080, () => console.log(`I'm listening.`));
