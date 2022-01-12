const express = require('express');
const router = express.Router();
const buscarNovedad = require('../services/buscar-novedad');


router.get('/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarNovedad.getMultiple(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer las novedades`, err.message);
    next(err);
  }
});


module.exports = router;