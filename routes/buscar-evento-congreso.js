const express = require('express');
const router = express.Router();
const buscarEventoCongreso = require('../services/buscar-evento-congreso');


router.get('/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarEventoCongreso.getMultiple(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer los Eventos Congresos`, err.message);
    next(err);
  }
});


module.exports = router;