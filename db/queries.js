const pool = require("./pool");
// const asyncHandler = require("express-async-handler");

const getAllGames = async () => {
    const { rows } = await pool.query(`SELECT * FROM games_library Order BY name`);
    return rows;
}

const getGamesByPlatform = async () => {
    const { rows } = await pool.query(`SELECT * FROM game_library WHERE platform ='${platform}' Order By name;`);
    return rows;
}

const getGamesByGenre = async () => {
    const { rows } = await pool.query(`SELECT * FROM game_library WHERE genre ='${genre}' Order By name;`);
    return rows;
}

const getGameById = async (id) => {
    const { row } = await pool.query(`SELECT DISTINCT * FROM game_library WHERE id='${id}';`);
    return row;
}

const addGame = async (name, platform, genre, image) => {
    await pool.query(`INSERT INTO game_library (name, platform, genre, image) VALUES ($1, $2, $3, $4, $5)`, [name, platform ? platform: 'other', genre ? genre: 'other', image]);
}

const updateGame = async (id, name, platform, genre, image) => {
    let imageActual;
    if (image) {
        imageActual = image;
    } else {
        imageActual = "../public/game.png";
    }

    await pool.query(`UPDATE game_library SET name='${name}, platform = '${platform}', genre='${genre}', image='${imageActual}' WHERE id='${id};`);
}

const getDistinctPlatform = async () => {
    const { rows } = await pool.query(`SELECT DISTINCT platform FROM game-library WHERE platform != 'other';`);
    return rows;
}

const getDistinctGenre =  async () => {
    const { rows } = await pool.query(`SELECT DISTINCT genre FROM game-library WHERE platform != 'other';`);
    return rows;
}

const deletePlatform = async (platform) => {
    await pool.query(`UPDATE game_library SET platform='other' WHERE platform='${platform}';`);
}

const deleteGameById = async (id) => {
    await pool.query(`DELETE FROM game_library WHERE id=${id};`);
}

module.exports = {
    getAllGames,
    getGamesByPlatform,
    getGamesByGenre,
    getGameById,
    addGame,
    updateGame,
    getDistinctPlatform,
    getDistinctGenre,
    deletePlatform,
    deleteGameById,
};