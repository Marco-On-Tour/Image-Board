const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:anna:postgres@localhost:5432/imageboard");

/**
 * @returns {Promise<any>[]>}
 * @param {number} imageId
 */
exports.loadComments = function (imageId) {
    return db
        .query("SELECT * FROM comments WHERE image_id = $1", [imageId])
        .then((result) =>
            result.rows.map((row) => ({
                comment: row.comment,
                username: row.username,
            }))
        );
};

function mapImageRow(row) {
    return {
        id: row.id,
        url: row.url,
        username: row.username,
        title: row.title,
        desc: row.description,
    };
}
exports.loadImages = function loadImages(lastSeenId) {
    if (!lastSeenId) {
        lastSeenId = 999999999;
    }
    return db
        .query(
            `SELECT * FROM images
             WHERE id < $1
             ORDER BY id DESC
             LIMIT 4`,
            [lastSeenId]
        )
        .then((result) => {
            return result.rows.map((row) => mapImageRow(row));
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

exports.insertComment = function (comment) {
    return db
        .query(
            "INSERT INTO comments (image_id, comment, username) VALUES ($1,$2,$3) returning id;",
            [comment.imageId, comment.comment, comment.username]
        )
        .then((result) => {
            const data = {
                comment: comment.comment,
                username: comment.username,
                id: result.rows[0].id,
            };
            return data;
        })
        .catch((error) => {
            console.log(error);
            return Promise.reject(error);
        });
};
