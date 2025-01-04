const pool = require("./pool");

const getAllGames = async () => {
  const { rows } = await pool.query(`
    SELECT
      g.title,
      g.img_url,
      ge.genre_name,
      STRING_AGG(p.platform_name, ', ') AS platforms
    FROM games g
    LEFT JOIN genres ge ON g.genre_id = ge.genre_id
    LEFT JOIN game_platforms gp ON g.game_id = gp.game_id
    LEFT JOIN platforms p ON gp.platform_id = p.platform_id
    GROUP BY g.game_id, ge.genre_name;
  `);

  return rows;
}

const getGamesByPlatform = async (platform) => {
  const { rows } = await pool.query(`
    SELECT 
      g.title, 
      g.img_url,
      ge.genre_name
    FROM games g
    JOIN genres ge ON g.genre_id = ge.genre_id
    JOIN game_platforms gp ON g.game_id = gp.game_id
    JOIN platforms p ON gp.platform_id = p.platform_id
    WHERE p.platform_name = '${platform}'
    ORDER BY g.title;
  `);

  return rows;
}

const getGamesByGenre = async (genre) => {

  const { rows } = await pool.query(`
    SELECT 
      g.title, 
      STRING_AGG(p.platform_name, ', ') AS platforms
    FROM games g
    JOIN genres ge ON g.genre_id = ge.genre_id
    JOIN game_platforms gp ON g.game_id = gp.game_id
    JOIN platforms p ON gp.platform_id = p.platform_id
    WHERE ge.genre_name = '${genre}'
    GROUP BY g.title;   
  `);



  return rows;
}

const getGameById = async (id) => {
  const { row } = await pool.query(`SELECT title AS game_title FROM games WHERE game_id='${id}';`);
  return row;
}

const addGame = async (name, platforms, genre, image) => {
  await pool.query(`
    INSERT INTO GENRES (genre_name)
    VALUES (${genre})
    ON DUPLICATE KEY UPDATE genre_id = genre_id;

    INSERT INTO games (title, genre_id)
    VALUES ('${name}', (SELECT genre_id FROM genres WHERE genre_name = '${genre}'));
  `);
  
  platforms.forEach(async (platform) => {
    await pool.query(`
      INSERT INTO platforms (platform_name)
      VALUES ('${platform}')
      ON DUPLICATE KEY UPDATE platform_id = platform_id;
  
      INSERT INTO game_platforms (game_id, platform_id)
      VALUES ((SELECT game_id FROM games WHERE title = '${name}'), (SELECT platform_id FROM platforms WHERE platform_name = '${platform}'));
    `);
  })
}

//Not complete yet
const updateGame = async (id, name, platform, genre, image) => {
  let imageActual;
  if (image) {
    imageActual = image;
  } else {
    imageActual = "../public/game.png";
  }

  await pool.query(`UPDATE game_library SET name='${name}', platform = '${platform}', genre='${genre}', image='${imageActual}' WHERE id='${id};`);
}

const getDistinctPlatforms = async () => {
  const { rows } = await pool.query(`SELECT * FROM platforms ORDER BY platform_name;`);
  
  return rows;
}

const getDistinctGenres =  async () => {
  const { rows } = await pool.query(`SELECT * FROM genres ORDER BY genre_name;`);

  return rows;
}

//Not complete yet
const deletePlatform = async (platform) => {
  await pool.query(`UPDATE game_library SET platform='other' WHERE platform='${platform}';`);
}

const deleteGameById = async (id) => {
  //Also deletes associated platform/genre if the game was the only title in that platform or genre.
  await pool.query(`
    DELETE FROM game_platforms
    WHERE game_id = X;

    DELETE FROM games
    WHERE game_id = X;

    DELETE FROM platforms
    WHERE platform_id NOT IN (
      SELECT DISTINCT platform_id
      FROM game_platforms
    )
    AND platform_id IN (
      SELECT platform_id
      FROM game_platforms
      WHERE game_id = X
    );

    DELETE FROM genres
    WHERE genre_id NOT IN (
      SELECT DISTINCT genre_id
      FROM games
    )
    AND genre_id IN (
      SELECT genre_id
      FROM games
      WHERE game_id = X
    );
  `);
}

module.exports = {
  getAllGames,
  getGamesByPlatform,
  getGamesByGenre,
  getGameById,
  addGame,
  updateGame,
  getDistinctPlatforms,
  getDistinctGenres,
  deletePlatform,
  deleteGameById,
};