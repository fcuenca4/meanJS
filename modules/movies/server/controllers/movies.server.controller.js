'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Movie = mongoose.model('Movie'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

exports.findById = function (req, res) {
    Movie.findById(req.params.id, function (err, movie) {
        if (err) return res.status(500).send(err.message);
        console.log('GET /movie/' + req.params.id);
        res.status(200).jsonp(movie);
    });
};
exports.buscarRelacionadas = function (req, res) {

    var pelicula;
    Movie.findById(req.params.id, function (err, movie) {
        if (err) return res.status(500).send(err.message);
        console.log("pelicula a buscar ref: " + req.params.id);
        pelicula = movie;
    });

    Movie.find(function (err, movies) {
        if (err) return res.send(500, err.message);
        var salida = [];
        var suficiente = false;
        if (pelicula !== null && pelicula !== undefined) {
            var palabras = pelicula.referencias;
            console.log("palabras de la peli a busc " + palabras);
            var puntero = 0;
            for (var i = 0; i < movies.length && !suficiente; i++) {
                var j = 0;
                var relaciona = false;
                var palabrasMovie = movies[i].referencias;
                console.log("palabras de la otra peli " + palabrasMovie);
                if (pelicula.id !== movies[i].id) {
                    for (j; j < palabras.length && !relaciona; j++) {
                        var k = 0;

                        for (k; k < palabrasMovie.length && !relaciona; k++) {
                            if (palabras[j] === palabrasMovie[k] && palabras[j] !== ' ') {
                                salida[puntero] = movies[i];
                                puntero++;
                                relaciona = true;
                                console.log("agregue relacionada " + palabras[j]);
                            }
                        }
                    }
                }
                if (salida.length > 5)
                    suficiente = true;
            }
            console.log('Relacionadas /movies');
        }

        res.status(200).jsonp(salida);


    });
};

/**
 * Create a Movie
 */
exports.create = function (req, res) {
    var movie = new Movie(req.body);
    movie.user = req.user;
    movie.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(movie);
        }
    });
};
/**
 * Show the current Movie
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var movie = req.movie ? req.movie.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    movie.isCurrentUserOwner = (req.user && movie.user && movie.user._id.toString() === req.user._id.toString()) || (req.user.roles.indexOf("admin") !== -1) ? true : false;

    res.jsonp(movie);
};

/**
 * Update a Movie
 */
exports.update = function (req, res) {
    var movie = req.movie;

    movie = _.extend(movie, req.body);

    movie.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(movie);
        }
    });
};

/**
 * Delete an Movie
 */
exports.delete = function (req, res) {
    var movie = req.movie;

    movie.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(movie);
        }
    });
};

/**
 * List of Movies
 */
exports.list = function (req, res) {
    Movie.find().sort('-created').populate('user', 'displayName').exec(function (err, movies) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(movies);
        }
    });
};
exports.list = function (req, res) {
    Movie.find().sort('-created').populate('user', 'displayName').exec(function (err, movies) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(movies);
        }
    });
};


/**
 * Movie middleware
 */
exports.movieByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Movie is invalid'
        });
    }

    Movie.findById(id).populate('user', 'displayName').exec(function (err, movie) {
        if (err) {
            return next(err);
        } else if (!movie) {
            return res.status(404).send({
                message: 'No Movie with that identifier has been found'
            });
        }
        req.movie = movie;
        next();
    });
};
