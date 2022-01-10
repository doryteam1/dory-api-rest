const express = require('express');
const router = express.Router();
const buscarEventoDiplomado = require('../services/buscar-evento-diplomado');


router.get('/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarEventoDiplomado.getMultiple(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer los Eventos Diplomados`, err.message);
    next(err);
  }
});


module.exports = router;