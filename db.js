const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:marconewman:@localhost:5432/images");

exports.getImages = () => {
    return db.query(
        "SELECT * FROM images;"
    )
};