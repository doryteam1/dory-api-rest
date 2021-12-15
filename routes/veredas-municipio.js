const express = require('express');
const router = express.Router();
const veredasMunicipio = require('../services/veredas-municipio');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await veredasMunicipio.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer las veredas del Municipio `, err.message);
    next(err);
  }
});

module.exports = router;