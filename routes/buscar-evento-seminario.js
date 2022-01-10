const express = require('express');
const router = express.Router();
const buscarEventoSeminario = require('../services/buscar-evento-seminario');


router.get('/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarEventoSeminario.getMultiple(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer los Eventos Cursos`, err.message);
    next(err);
  }
});


module.exports = router;