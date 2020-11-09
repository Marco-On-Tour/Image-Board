const aws = require("aws-sdk");
const fs = require("fs");
let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets").credentials; // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});
const BUCKET_NAME = "spicedling";
exports.getUrl = (filename) => {
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${filename}`;
};
exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("multer failed :-/");
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: "spicedling",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then(() => {
            // it worked!
            next();
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            console.log(err);
            return res.sendStatus(500);
        });
};
