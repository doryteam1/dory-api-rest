const express = require('express');
const router = express.Router();
const granjasMunicipio = require('../services/granjas-municipio');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await granjasMunicipio.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer los Pescadores de las asociaciones `, err.message);
    next(err);
  }
});

module.exports = router;