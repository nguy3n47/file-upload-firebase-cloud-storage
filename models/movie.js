const db = require('../config/db');
const Sequelize = require('sequelize');

const Movie = db.define('Movie', {
  poster: Sequelize.TEXT,
});

module.exports = Movie;
