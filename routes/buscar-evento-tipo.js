const express = require('express');
const router = express.Router();
const buscarEventoTipo = require('../services/buscar-evento-tipo');


router.get('/:tipo', async function(req, res, next) {
  try {
    res.json(await buscarEventoTipo.getMultiple(req.query.page,req.params.tipo));
  } catch (err) {
    console.error(`Error al traer los Eventos por tipo`, err.message);
    next(err);
  }
});


module.exports = router;