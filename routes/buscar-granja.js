const express = require('express');
const router = express.Router();
const buscarGranja = require('../services/buscar-granja');


router.get('/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarGranja.getMultiple(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer las granjas con esa cadena `, err.message);
    next(err);
  }
});


module.exports = router;