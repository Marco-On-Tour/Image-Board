const express = require("express");
const app = express();
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const fs = require("fs");
const db = require("./db.js");
function group(array, getKey) {
    const result = {};
    for (item of array) {
        const key = getKey(item);
        result[key] = item;
    }
    return result;
}

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
        const url = "/uploads/" + filename;
        db.insertImage({ url, username, title, desc })
            .then((image) => {
                image.success = true;
                res.json(image);
            })
            .catch(() => res.status(500));
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/images", (req, resp) => {
    // turn "1" into 1
    const lastSeenId = Number(req.query.lastId);
    if (lastSeenId) {
        return db.loadImages(lastSeenId).then((images) => resp.json(images));
    } else {
        return db.loadImages().then((images) => resp.json(images));
    }
});

app.get("/images/:imageId/comments", (req, resp) => {
    return db.loadComments(req.imageId).then((result) => resp.json(result));
});

app.post("/comments", (req, resp) => {
    console.log(req.body);
    const { comment, username, imageId } = req.body;
    return db
        .query(
            "INSERT INTO comments (image_id, comment, username) VALUES ($1,$2,$3) returning id;"
        )
        .then((result) => {
            const data = { imageId, comment, username, id: result.rows[0].id };
            return resp.json(data);
        });
});

app.use(express.static("./public"));

app.use(express.json());

app.listen(8080, () => console.log(`I'm listening.`));
