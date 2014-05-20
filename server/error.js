'use strict';

module.exports = {

  // development error handler
  // will print stacktrace
  development: function(err, req, res) {
    var customError = {
      message: err.message,
      error: err
    };
    res.status(err.status || 500);
    res.format({
      json: function(){
        res.send(customError);
      },
      html: function(){
        res.render('error', customError);
      }
    });
  },

  // production error handler
  // no stacktraces leaked to user
  production: function(err, req, res) {
    var customError = {
      message: err.message
    };
    res.status(err.status || 500);
    res.format({
      json: function(){
        res.send(customError);
      },
      html: function(){
        res.render('error', customError);
      }
    });
  }
};
