'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Movie = mongoose.model('Movie'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, movie;

/**
 * Movie routes tests
 */
describe('Movie CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Movie
    user.save(function () {
      movie = {
        name: 'Movie name'
      };

      done();
    });
  });

  it('should be able to save a Movie if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Movie
        agent.post('/api/movies')
          .send(movie)
          .expect(200)
          .end(function (movieSaveErr, movieSaveRes) {
            // Handle Movie save error
            if (movieSaveErr) {
              return done(movieSaveErr);
            }

            // Get a list of Movies
            agent.get('/api/movies')
              .end(function (moviesGetErr, moviesGetRes) {
                // Handle Movie save error
                if (moviesGetErr) {
                  return done(moviesGetErr);
                }

                // Get Movies list
                var movies = moviesGetRes.body;

                // Set assertions
                (movies[0].user._id).should.equal(userId);
                (movies[0].name).should.match('Movie name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Movie if not logged in', function (done) {
    agent.post('/api/movies')
      .send(movie)
      .expect(403)
      .end(function (movieSaveErr, movieSaveRes) {
        // Call the assertion callback
        done(movieSaveErr);
      });
  });

  it('should not be able to save an Movie if no name is provided', function (done) {
    // Invalidate name field
    movie.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Movie
        agent.post('/api/movies')
          .send(movie)
          .expect(400)
          .end(function (movieSaveErr, movieSaveRes) {
            // Set message assertion
            (movieSaveRes.body.message).should.match('Please fill Movie name');

            // Handle Movie save error
            done(movieSaveErr);
          });
      });
  });

  it('should be able to update an Movie if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Movie
        agent.post('/api/movies')
          .send(movie)
          .expect(200)
          .end(function (movieSaveErr, movieSaveRes) {
            // Handle Movie save error
            if (movieSaveErr) {
              return done(movieSaveErr);
            }

            // Update Movie name
            movie.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Movie
            agent.put('/api/movies/' + movieSaveRes.body._id)
              .send(movie)
              .expect(200)
              .end(function (movieUpdateErr, movieUpdateRes) {
                // Handle Movie update error
                if (movieUpdateErr) {
                  return done(movieUpdateErr);
                }

                // Set assertions
                (movieUpdateRes.body._id).should.equal(movieSaveRes.body._id);
                (movieUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Movies if not signed in', function (done) {
    // Create new Movie model instance
    var movieObj = new Movie(movie);

    // Save the movie
    movieObj.save(function () {
      // Request Movies
      request(app).get('/api/movies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Movie if not signed in', function (done) {
    // Create new Movie model instance
    var movieObj = new Movie(movie);

    // Save the Movie
    movieObj.save(function () {
      request(app).get('/api/movies/' + movieObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', movie.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Movie with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/movies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Movie is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Movie which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Movie
    request(app).get('/api/movies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Movie with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Movie if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Movie
        agent.post('/api/movies')
          .send(movie)
          .expect(200)
          .end(function (movieSaveErr, movieSaveRes) {
            // Handle Movie save error
            if (movieSaveErr) {
              return done(movieSaveErr);
            }

            // Delete an existing Movie
            agent.delete('/api/movies/' + movieSaveRes.body._id)
              .send(movie)
              .expect(200)
              .end(function (movieDeleteErr, movieDeleteRes) {
                // Handle movie error error
                if (movieDeleteErr) {
                  return done(movieDeleteErr);
                }

                // Set assertions
                (movieDeleteRes.body._id).should.equal(movieSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Movie if not signed in', function (done) {
    // Set Movie user
    movie.user = user;

    // Create new Movie model instance
    var movieObj = new Movie(movie);

    // Save the Movie
    movieObj.save(function () {
      // Try deleting Movie
      request(app).delete('/api/movies/' + movieObj._id)
        .expect(403)
        .end(function (movieDeleteErr, movieDeleteRes) {
          // Set message assertion
          (movieDeleteRes.body.message).should.match('User is not authorized');

          // Handle Movie error error
          done(movieDeleteErr);
        });

    });
  });

  it('should be able to get a single Movie that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Movie
          agent.post('/api/movies')
            .send(movie)
            .expect(200)
            .end(function (movieSaveErr, movieSaveRes) {
              // Handle Movie save error
              if (movieSaveErr) {
                return done(movieSaveErr);
              }

              // Set assertions on new Movie
              (movieSaveRes.body.name).should.equal(movie.name);
              should.exist(movieSaveRes.body.user);
              should.equal(movieSaveRes.body.user._id, orphanId);

              // force the Movie to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Movie
                    agent.get('/api/movies/' + movieSaveRes.body._id)
                      .expect(200)
                      .end(function (movieInfoErr, movieInfoRes) {
                        // Handle Movie error
                        if (movieInfoErr) {
                          return done(movieInfoErr);
                        }

                        // Set assertions
                        (movieInfoRes.body._id).should.equal(movieSaveRes.body._id);
                        (movieInfoRes.body.name).should.equal(movie.name);
                        should.equal(movieInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Movie.remove().exec(done);
    });
  });
});
