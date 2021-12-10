const express = require('express');
const router = express.Router();
const piscicultoresMunicipio = require('../services/piscicultores-municipio');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await piscicultoresMunicipio.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer los piscicultores de los municipios `, err.message);
    next(err);
  }
});

module.exports = router;