const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:anna:postgres@localhost:5432/imageboard");

/**
 * @returns {Promise<{id:number, url:string, username:string, title:string, description:string}[]>}
 *
 */
exports.loadImages = function loadImages() {
    return db
        .query("SELECT id, url, username, title, description FROM images;")
        .then((result) => {
            return result.rows.map((row) => ({
                id: row.id,
                url: row.url,
                username: row.username,
                title: row.title,
                description: row.description,
            }));
        });
};
