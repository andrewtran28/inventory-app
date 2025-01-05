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
  ('Puzzle'),
  ('Other');

  INSERT INTO platforms (platform_name) VALUES 
  ('PC'),
  ('PlayStation'),
  ('Xbox'),
  ('Nintendo Switch'),
  ('Mobile'),
  ('Other');

  INSERT INTO games (title, genre_id) VALUES 
  ('The Witcher 3: Wild Hunt', 2),  -- RPG
  ('Grand Theft Auto V', 1),  -- Action
  ('The Legend of Zelda: Breath of the Wild', 3),  -- Adventure
  ('Call of Duty: Modern Warfare', 4),  -- Shooter
  ('Civilization VI', 5),  -- Strategy
  ('The Sims 4', 6),  -- Simulation
  ('Tekken 7', 7),  -- Fighting
  ('Forza Horizon 5', 8),  -- Racing
  ('Resident Evil Village', 9),  -- Horror
  ('Portal 2', 10);

  INSERT INTO game_platforms (game_id, platform_id) VALUES
  (1, 1),  -- The Witcher 3: Wild Hunt on PC
  (1, 2),  -- The Witcher 3: Wild Hunt on PlayStation
  (2, 1),  -- Grand Theft Auto V on PC
  (2, 2),  -- Grand Theft Auto V on PlayStation
  (3, 2),  -- The Legend of Zelda: Breath of the Wild on PlayStation
  (3, 4),  -- The Legend of Zelda: Breath of the Wild on Nintendo Switch
  (4, 1),  -- Call of Duty: Modern Warfare on PC
  (4, 2),  -- Call of Duty: Modern Warfare on PlayStation
  (5, 1),  -- Civilization VI on PC
  (5, 3),  -- Civilization VI on Xbox
  (6, 1),  -- The Sims 4 on PC
  (6, 2),  -- The Sims 4 on PlayStation
  (7, 2),  -- Tekken 7 on PlayStation
  (7, 3),  -- Tekken 7 on Xbox
  (8, 1),  -- Forza Horizon 5 on PC
  (8, 3),  -- Forza Horizon 5 on Xbox
  (9, 1),  -- Resident Evil Village on PC
  (9, 2),  -- Resident Evil Village on PlayStation
  (10, 1);  -- Portal 2 on PC
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

// const SQL = `
//   CREATE TABLE IF NOT EXISTS game_library (
//   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   name VARCHAR( 255 ),
//   platform VARCHAR ( 255 ),
//   genre VARCHAR ( 255 )
//   );

//   INSERT INTO game_library (name, platform, genre)
//   VALUES
//   ('The Legend of Zelda: Breath of the Wild', 'Nintendo Switch', 'Action-Adventure'),
//   ('Halo Infinite', 'Xbox Series X, PC', 'First-Person Shooter'),
//   ('God of War Ragnarök', 'PlayStation 5, PlayStation 4', 'Action-Adventure'),
//   ('Super Mario Odyssey', 'Nintendo Switch', 'Platformer'),
//   ('Red Dead Redemption 2', 'PS4, Xbox One, PC', 'Action-Adventure'),
//   ('Minecraft', 'PC, Xbox, PlayStation, Switch, Mobile', 'Sandbox'),
//   ('Gran Turismo 7', 'PlayStation 5, PlayStation 4', 'Racing'),
//   ('Fortnite', 'PC, Xbox, PlayStation, Switch, Mobile', 'Battle Royale'),
//   ('Animal Crossing: New Horizons', 'Nintendo Switch', 'Life Simulation'),
//   ('FIFA 23', 'PC, Xbox, PlayStation, Switch', 'Sports'),
//   ('The Witcher 3: Wild Hunt', 'PC, PS4, Xbox One, Switch', 'Role-Playing Game'),
//   ('Overwatch 2', 'PC, Xbox, PlayStation, Switch', 'First-Person Shooter')
// `;
