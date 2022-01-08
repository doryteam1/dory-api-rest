const express = require('express');
const router = express.Router();
const buscarNormatividad = require('../services/buscar-normatividad');


router.get('/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarNormatividad.getMultiple(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer las normatividades por Cadena`, err.message);
    next(err);
  }
});


module.exports = router;