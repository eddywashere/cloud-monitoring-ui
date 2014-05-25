'use strict';

module.exports = {

  // development error handler
  // will print stacktrace
  development: function(err, req, res, next) {
    var customError = {
      message: err.message,
      error: err
    };
    res.status(err.status || 500);
    res.format({
      json: function(){
        res.json(customError);
      },
      html: function(){
        res.render('error', customError);
      }
    });
  },

  // production error handler
  // no stacktraces leaked to user
  production: function(err, req, res, next) {
    var customError = {
      message: err.message
    };
    res.status(err.status || 500);
    res.format({
      json: function(){
        res.json(customError);
      },
      html: function(){
        res.render('error', customError);
      }
    });
  }
};
