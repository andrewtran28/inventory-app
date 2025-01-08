#! /usr/bin/env node

const { Client } = require("pg");
require('dotenv').config();

const SQL = `
  DROP TABLE IF EXISTS genres CASCADE;
  DROP TABLE IF EXISTS games CASCADE;
  DROP TABLE IF EXISTS platforms CASCADE;
  DROP TABLE IF EXISTS game_platforms CASCADE;

  CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    genre_name VARCHAR(100) NOT NULL
  );


  CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    img_url VARCHAR(255),
    thumb_url VARCHAR(255),
    genre_id INT REFERENCES genres(genre_id) ON DELETE SET NULL
  );


  CREATE TABLE platforms (
    platform_id SERIAL PRIMARY KEY,
    platform_name VARCHAR(100) NOT NULL
  );

  CREATE TABLE game_platforms (
    game_id INT REFERENCES games(game_id) ON DELETE CASCADE,
    platform_id INT REFERENCES platforms(platform_id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, platform_id)
  );

  INSERT INTO genres (genre_name) VALUES 
    ('Action'),
    ('RPG'),
    ('Adventure'),
    ('Shooter'),
    ('Strategy'),
    ('Simulation'),
    ('Fighting'),
    ('Racing'),
    ('Horror'),
    ('Puzzle');

  INSERT INTO platforms (platform_name) VALUES 
    ('PC'),
    ('PlayStation'),
    ('Xbox'),
    ('Nintendo Switch');

  INSERT INTO games (title, img_url, thumb_url, genre_id) VALUES 
    ('Overwatch 2', 'https://www.giantbomb.com/a/uploads/scale_small/33/338034/3412993-8877030914-iVhWn.jpg', 'https://www.giantbomb.com/a/uploads/scale_avatar/33/338034/3412993-8877030914-iVhWn.jpg', 4),
    ('Rivals of Aether 2', 'https://www.giantbomb.com/a/uploads/scale_small/16/164924/3641557-unnamed%281%29.jpg', 'https://www.giantbomb.com/a/uploads/scale_avatar/16/164924/3641557-unnamed%281%29.jpg', 7),
    ('Hades', 'https://www.giantbomb.com/a/uploads/scale_small/20/201266/3532848-5240368293-co39v.png', 'https://www.giantbomb.com/a/uploads/scale_avatar/20/201266/3532848-5240368293-co39v.png', 2),
    ('Mario Kart 8', 'https://www.giantbomb.com/a/uploads/scale_small/20/201266/3541576-4801018091-co213.png', 'https://www.giantbomb.com/a/uploads/scale_avatar/20/201266/3541576-4801018091-co213.png', 8),
    ('Monster Hunter Rise', 'https://www.giantbomb.com/a/uploads/scale_small/20/201266/3541599-9448729192-co3uz.jpg', 'https://www.giantbomb.com/a/uploads/scale_avatar/20/201266/3541599-9448729192-co3uz.jpg', 2),
    ('Monster Hunter World', 'https://www.giantbomb.com/a/uploads/scale_small/0/3699/2996112-monster%20hunter%20-%20world%20v1.jpg', 'https://www.giantbomb.com/a/uploads/scale_avatar/0/3699/2996112-monster%20hunter%20-%20world%20v1.jpg', 2),
    ('Animal Crossing: New Horizons', 'https://www.giantbomb.com/a/uploads/scale_small/8/82063/3179211-acnhart.jpg', 'https://www.giantbomb.com/a/uploads/scale_avatar/8/82063/3179211-acnhart.jpg', 6),
    ('Marvel Rivals', 'https://www.giantbomb.com/a/uploads/scale_small/16/164924/3562830-3679431021-marve.jpg', 'https://www.giantbomb.com/a/uploads/scale_avatar/16/164924/3562830-3679431021-marve.jpg', 1),
    ('Helldivers 2', 'https://www.giantbomb.com/a/uploads/scale_small/33/338034/3471226-7291866793-f1b07.png', 'https://www.giantbomb.com/a/uploads/scale_avatar/33/338034/3471226-7291866793-f1b07.png', 4),
    ('Lethal Company', 'https://www.giantbomb.com/a/uploads/scale_small/33/338034/3518893-4397218415-libra.jpg', 'https://www.giantbomb.com/a/uploads/scale_avatar/33/338034/3518893-4397218415-libra.jpg', 9),
    ('Phasmophobia', 'https://www.giantbomb.com/a/uploads/scale_small/47/473297/3203507-twitchcapsuleimage.jpg', 'https://www.giantbomb.com/a/uploads/scale_avatar/47/473297/3203507-twitchcapsuleimage.jpg', 9),
    ('Dave the Diver', 'https://www.giantbomb.com/a/uploads/scale_small/0/1992/3426344-0367471822-libra.jpg', 'https://www.giantbomb.com/a/uploads/scale_avatar/0/1992/3426344-0367471822-libra.jpg', 2),
    ('Super Smash Bros Ultimate', 'https://www.giantbomb.com/a/uploads/scale_small/20/201266/3515903-1095697296-hero_.jpg', 'https://www.giantbomb.com/a/uploads/scale_avatar/20/201266/3515903-1095697296-hero_.jpg', 7),
    ('Taiko no Tatsujin: Rhythm Festival', 'https://www.giantbomb.com/a/uploads/scale_small/59/594908/3452240-8018604131-hero.jpg', 'https://www.giantbomb.com/a/uploads/scale_avatar/59/594908/3452240-8018604131-hero.jpg', 10),
    ('Risk of Rain 2', 'https://www.giantbomb.com/a/uploads/scale_small/8/87790/3124945-box_ror2.png', 'https://www.giantbomb.com/a/uploads/scale_avatar/8/87790/3124945-box_ror2.png', 5);

  INSERT INTO game_platforms (game_id, platform_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 4),
    (2, 1),
    (3, 1), (3, 2), (3, 4),
    (4, 4),
    (5, 1), (5, 4),
    (6, 1), (6, 2), (6, 3),
    (7, 4),
    (8, 1), (8, 2), (8, 3),
    (9, 1), (9, 2),
    (10, 1),
    (11, 1),
    (12, 1), (12, 4),
    (13, 4),
    (14, 4),
    (15, 1), (15, 2), (15, 3);
`;

async function main() {
  const client = new Client({
  connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
}

main();