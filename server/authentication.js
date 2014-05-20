var passport = require('passport');
var KeystoneStrategy = require('passport-keystone').Strategy;

module.exports = {

  // Use the KeystoneStrategy within Passport.
  //   Strategies in passport require a `verify` function, which accept
  //   credentials (in this case, a username and password), and invoke a callback
  //   with a user object.  In the real world, this would query a database;
  //   however, in this example we are using a baked-in set of users.

  keystoneStrategy: new KeystoneStrategy(
    {
      authUrl: 'https://identity.api.rackspacecloud.com',
      region: 'ord',
      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, identity, done) {
      if (!req.user) {
        var user = {};
        user.id    = identity.user.id;
        user.username  = identity.user.name;
        user.tenant  = identity.token.tenant.id;
        user.token = identity.token.id;
        user.serviceCatalog = identity.raw.access.serviceCatalog;
        req.session.cookie.expires = Date.parse(identity.token.expires) - Date.now();
        return done(null, user);
      } else {
        // user already exists and is logged in, we have to link accounts
        var user = req.user; // pull the user out of the session
        user.token = identity.token.id;
        req.session.cookie.expires = Date.parse(identity.token.expires) - Date.now();
        return done(null, user);
      }
    }
  ),

  serializeUser: function(user, done) {
    done(null, user);
  },

  deserializeUser: function(obj, done) {
    done(null, obj);
  },

  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect('/');
    }
  },

  csrf: function(req) {
    var token = (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || (req.headers['x-csrf-token'])
    || (req.headers['x-xsrf-token']);
    return token;
  }
};
