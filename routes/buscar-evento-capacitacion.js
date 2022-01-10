const express = require('express');
const router = express.Router();
const buscarEventoCapacitacion = require('../services/buscar-evento-capacitacion');


router.get('/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarEventoCapacitacion.getMultiple(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer los Eventos Capacitaciones`, err.message);
    next(err);
  }
});


module.exports = router;