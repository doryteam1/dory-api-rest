const express = require('express');
const router = express.Router();
const login = require('../services/login');

router.post('/', async function(req, res, next) {
  try {
    res.json(await login.createLogin(req.body));
  } catch (err) {
    console.error(`Error al loguear al usuario - Nose creo Token`, err.message);
    next(err);
  }
});


module.exports = router;