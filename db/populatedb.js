#! /usr/bin/env node

const { Client } = require("pg");
require('dotenv').config();

const SQL = `
    CREATE TABLE all_inventory (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR ( 255 ), brand VARCHAR ( 255 ), battery BOOLEAN, price FLOAT, image VARCHAR (255));

    CREATE TABLE IF NOT EXISTS game_library (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR( 255 ),
        platform VARCHAR ( 255 ),
        genre VARCHAR ( 255 )
    );

    INSERT INTO game_library (name, platform, genre)
    VALUES
        ('The Legend of Zelda: Breath of the Wild', 'Nintendo Switch', 'Action-Adventure'),
        ('Halo Infinite', 'Xbox Series X, PC', 'First-Person Shooter'),
        ('God of War Ragnarök', 'PlayStation 5, PlayStation 4', 'Action-Adventure'),
        ('Super Mario Odyssey', 'Nintendo Switch', 'Platformer'),
        ('Red Dead Redemption 2', 'PS4, Xbox One, PC', 'Action-Adventure'),
        ('Minecraft', 'PC, Xbox, PlayStation, Switch, Mobile', 'Sandbox'),
        ('Gran Turismo 7', 'PlayStation 5, PlayStation 4', 'Racing'),
        ('Fortnite', 'PC, Xbox, PlayStation, Switch, Mobile', 'Battle Royale'),
        ('Animal Crossing: New Horizons', 'Nintendo Switch', 'Life Simulation'),
        ('FIFA 23', 'PC, Xbox, PlayStation, Switch', 'Sports'),
        ('The Witcher 3: Wild Hunt', 'PC, PS4, Xbox One, Switch', 'Role-Playing Game'),
        ('Overwatch 2', 'PC, Xbox, PlayStation, Switch', 'First-Person Shooter')`;

async function main() {
    console.log("Populating game library database");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Database populated.");
}

main();