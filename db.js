const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:marconewman:@localhost:5432/images");

exports.initDB = () => {

    return db.query(
        `DROP TABLE IF EXISTS comments;
        DROP TABLE IF EXISTS images;
        

        CREATE TABLE images(
            id SERIAL PRIMARY KEY,
            url VARCHAR NOT NULL,
            username VARCHAR NOT NULL,
            title VARCHAR NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE comments(
            id SERIAL PRIMARY KEY,
            username VARCHAR NOT NULL,
            comment TEXT NOT NULL,
            imageId INTEGER NOT NULL REFERENCES images(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

    
        
        INSERT INTO images (url, username, title, description) VALUES (
            'https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg',
            'funkychicken',
            'Welcome to Spiced and the Future!',
            'This photo brings back so many great memories.'
        );
        
        INSERT INTO images (url, username, title, description) VALUES (
            'https://s3.amazonaws.com/imageboard/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg',
            'discoduck',
            'Elvis',
            'We can''t go on together with suspicious minds.'
        );
        
        INSERT INTO images (url, username, title, description) VALUES (
            'https://s3.amazonaws.com/imageboard/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg',
            'discoduck',
            'To be or not to be',
            'That is the question.'
        );
        `
    )

}

exports.getImages = () => {
    return db.query(
        "SELECT * FROM images ORDER BY id DESC;"
    );
};

exports.uploadImage = (url, username, title, description) => {
    return db.query (
        'INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *;'
        , [url, username, title, description]
    );
};

exports.getImageById = (id) => {
    return db.query(
        "SELECT * FROM images WHERE id = $1;", [id]
    );
};

/// add more images

exports.getMoreImages = lastId => db.query(
    "SELECT * FROM images WHERE id < $1 ORDER BY id DESC LIMIT 12;", [lastId]
);

///commenting

exports.getComments = imageId => {
    return db.query("SELECT * FROM comments WHERE imageId = $1;", [imageId]);

};

exports.uploadComment = (username, comment, imageId) => {
    return db.query ("INSERT INTO comments (username, comment, imageId) VALUES ($1, $2, $3) RETURNING *;",[username, comment, imageId]);
}