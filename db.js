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
/**
 * @param image { url:string, username:string, title:string, description:string}
 * @returns {Promise<{id:number, url:string, username:string, title:string, description:string}}
 */
exports.insertImage = function (image) {
    return db
        .query(
            `INSERT INTO images (url, username, title, description, created_at)
            VALUES ($1,$2,$3,$4,$5) returning id, created_at`,
            [image.url, image.username, image.title, image.desc, new Date()]
        )
        .then((result) => {
            const { created_at, id } = result.rows[0];
            return {
                url: image.url,
                username: image.username,
                title: image.title,
                desc: image.desc,
                created_at,
                id,
            };
        })
        .catch((error) => {
            console.error(error);
        });
};
