var express = require('express');
var router = express.Router();


router.get('/styleguide', function(req, res){
  res.render('styleguide', { user: req.user, title: 'Dashboard - Styleguide' });
});

module.exports = router;
