const express = require('express');
const router = express.Router();
const corregimientosMunicipio = require('../services/corregimientos-municipio');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await corregimientosMunicipio.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer los corregimientos del Municipio `, err.message);
    next(err);
  }
});

module.exports = router;