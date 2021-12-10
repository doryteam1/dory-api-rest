const express = require('express');
const router = express.Router();
const pescadoresMunicipio = require('../services/pescadores-municipio');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await pescadoresMunicipio.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer los Pescadores de los municipios `, err.message);
    next(err);
  }
});

module.exports = router;