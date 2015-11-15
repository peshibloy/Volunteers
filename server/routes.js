/**
 * Main application routes
 */

'use strict';

module.exports = function (app) {

  var express = require('express');
  var passport = require('passport');
  var auth = require('./controllers/auth.server.controller');

  var config = require('./config/environment');
  var errors = require('./components/errors');
  var pg = require('pg');

  app.use('/api/things', require('./api/thing'));
  app.post('/auth/signin', auth.signin);

  var conString = config.postgres.db;

  pg.connect(conString, connectToDb);
  function connectToDb(err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT $1::int AS number', ['1'], function (err, result) {
        done();
        if (err) {
          return console.error('error running query', err);
        }
        console.log(result.rows[0].number);
      });
  }
  function auth(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      var error = err || info;
      if (error) return res.json(401, error);
      if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

      var token = auth.signToken(user._id, user.role);
      res.json({token: token});
    })(req, res, next)
  }

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function (req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
