'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Movie Schema
 */
var MovieSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Movie name',
        trim: true
    },
    director: String,
    calificacion: Number,
    related: Object,
    poster: String,
    imdbId: String,
    genero: String,
    imdbRating: String,
    tomatoRating: String,
    fecha: String,
    actores: String,
    sinopsis: String,
    duracion: String,
    calificaciones: Number,
    valoracion: Number,
    imagen: String,
    refe: [Schema.Types.ObjectId],
    referencias: [String],
    rating: {
        type: Number,
        default: 0
    },
    tags: String,
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Movie', MovieSchema);
