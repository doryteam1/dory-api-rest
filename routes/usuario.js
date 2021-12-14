const express = require('express');
const router = express.Router();
const usuario = require('../services/usuario');


router.get('/:cedula', async function(req, res, next) {
  try {
    res.json(await usuario.getMultiple(req.query.page,req.params.cedula));
  } catch (err) {
    console.error(`Error al traer el usuario`, err.message);
    next(err);
  }
});


module.exports = router;