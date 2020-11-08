CREATE TABLE comments (
    id serial primary key,
    image_id int not null references images(id),
    comment TEXT not null,
    username VARCHAR NOT NULL
);