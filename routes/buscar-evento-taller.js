const express = require('express');
const router = express.Router();
const buscarEventoTaller = require('../services/buscar-evento-taller');


router.get('/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarEventoTaller.getMultiple(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer los Eventos Talleres`, err.message);
    next(err);
  }
});


module.exports = router;