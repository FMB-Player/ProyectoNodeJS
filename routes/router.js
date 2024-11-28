var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // console.log(path.join(__dirname + '/../views/index.html'));
  res.sendFile(path.join(__dirname + '/../views/index.html'));
});

// show personaje
router.get('/personaje/:id', function(req, res) {
  res.sendFile(path.join(__dirname + '/../views/personaje.html'));
});

// Ruta para obtener el menú (resources.js).
router.get('/resources/menu', function(req, res) {
  res.sendFile(path.join(__dirname + '/../public/resources/menu.html'));
});

// Ruta para obtener el footer (resources.js).
router.get('/resources/footer', function(req, res) {
  res.sendFile(path.join(__dirname + '/../public/resources/footer.html'));
});

module.exports = router;
