const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:marco:@localhost:5432/imageboard");

exports.getImages = () => {
    return db.query(
        "SELECT * FROM images;"
    )
};