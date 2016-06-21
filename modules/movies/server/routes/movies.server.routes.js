'use strict';

/**
 * Module dependencies
 */
var moviesPolicy = require('../policies/movies.server.policy'),
    movies = require('../controllers/movies.server.controller');

module.exports = function (app) {
    // Movies Routes
    app.route('/api/movies').all(moviesPolicy.isAllowed)
        .get(movies.list)
        .post(movies.create);

    app.route('/api/movies/:movieId').all(moviesPolicy.isAllowed)
        .get(movies.read)
        .put(movies.update)
        .delete(movies.delete);
    app.route('/api/movies/relacionadas/:id')
        .get(movies.buscarRelacionadas);
    // Finish by binding the Movie middleware
    app.param('movieId', movies.movieByID);
    // app.param('movieTag',movies.moviesByTag);
};
