const pool = require("./pool");

const getAllGames = async () => {
  // const { rows } = await pool.query(`SELECT * FROM games_library Order BY name`);
  const { rows } = await pool.query(`
  SELECT 
    g.title AS game_title, 
    ge.genre_name AS genre, 
    GROUP_CONCAT(p.platform_name ORDER BY p.platform_name SEPARATOR ', ') AS platforms
  FROM Games g
  JOIN Genres ge ON g.genre_id = ge.genre_id
  JOIN Game_Platforms gp ON g.game_id = gp.game_id
  JOIN Platforms p ON gp.platform_id = p.platform_id
  GROUP BY g.game_id, g.title, ge.genre_name
  ORDER BY g.title;
  `);
  return rows;
}

const getGamesByPlatform = async (platform) => {
  // const { rows } = await pool.query(`SELECT * FROM game_library WHERE platform ='${platform}' Order By name;`);
  const { rows } = await pool.query(`
  SELECT g.title
  FROM Games g
  JOIN Game_Platforms gp ON g.game_id = gp.game_id
  JOIN Platforms p ON gp.platform_id = p.platform_id
  WHERE p.platform_name = '${platform}'
  ORDER BY g.title;
  `);
  return rows;
}

const getGamesByGenre = async (genre) => {
  // const { rows } = await pool.query(`SELECT * FROM game_library WHERE genre ='${genre}' Order By name;`);
  const { rows } = await pool.query(`
  SELECT 
    g.title AS game_title, 
    ge.genre_name AS genre, 
    GROUP_CONCAT(p.platform_name ORDER BY p.platform_name SEPARATOR ', ') AS platforms
  FROM Games g
  JOIN Genres ge ON g.genre_id = ge.genre_id
  JOIN Game_Platforms gp ON g.game_id = gp.game_id
  JOIN Platforms p ON gp.platform_id = p.platform_id
  WHERE ge.genre_name = '${genre}'
  GROUP BY g.game_id, g.title, ge.genre_name
  ORDER BY g.title;
  `);
  return rows;
}

const getGameById = async (id) => {
  const { row } = await pool.query(`SELECT title AS game_title FROM Games WHERE game_id='${id}';`);
  return row;
}

const addGame = async (name, platforms, genre, image) => {
  // await pool.query(`INSERT INTO game_library (name, platform, genre, image) VALUES ($1, $2, $3, $4, $5)`, [name, platform ? platform: 'other', genre ? genre: 'other', image]);

  await pool.query(`
    INSERT INTO GENRES (genre_name)
    VALUES (${genre})
    ON DUPLICATE KEY UPDATE genre_id = genre_id;

    INSERT INTO Games (title, genre_id)
    VALUES ('${name}', (SELECT genre_id FROM Genres WHERE genre_name = '${genre}'));
  `);
  
  platforms.forEach(async (platform) => {
    await pool.query(`
      INSERT INTO Platforms (platform_name)
      VALUES ('${platform}')
      ON DUPLICATE KEY UPDATE platform_id = platform_id;
  
      INSERT INTO Game_Platforms (game_id, platform_id)
      VALUES ((SELECT game_id FROM Games WHERE title = '${name}'), (SELECT platform_id FROM Platforms WHERE platform_name = '${platform}'));
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
  // const { rows } = await pool.query("SELECT DISTINCT platform FROM game_library WHERE platform != 'other';")
  const { rows } = await pool.query(`
    SELECT * FROM Platforms;
  `);
  
  return rows;
}

const getDistinctGenres =  async () => {
  const { rows } = await pool.query(`
    SELECT * FROM Genres;
  `);
  return rows;
}

//Not complete yet
const deletePlatform = async (platform) => {
  await pool.query(`UPDATE game_library SET platform='other' WHERE platform='${platform}';`);
}

const deleteGameById = async (id) => {
  // await pool.query(`DELETE FROM game_library WHERE id=${id};`);

  //Also deletes associated platform/genre if the game was the only title in that platform or genre.
  await pool.query(`
    DELETE FROM Game_Platforms
    WHERE game_id = X;

    DELETE FROM Games
    WHERE game_id = X;

    DELETE FROM Platforms
    WHERE platform_id NOT IN (
        SELECT DISTINCT platform_id
        FROM Game_Platforms
    )
    AND platform_id IN (
        SELECT platform_id
        FROM Game_Platforms
        WHERE game_id = X
    );

    DELETE FROM Genres
    WHERE genre_id NOT IN (
        SELECT DISTINCT genre_id
        FROM Games
    )
    AND genre_id IN (
        SELECT genre_id
        FROM Games
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