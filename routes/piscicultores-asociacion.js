const express = require('express');
const router = express.Router();
const piscicultoresAsociacion = require('../services/piscicultores-asociacion');


router.get('/:nit', async function(req, res, next) {
  try {
    res.json(await piscicultoresAsociacion.getMultiple(req.query.page,req.params.nit));
  } catch (err) {
    console.error(`Error al traer los Piscicultores de las asociaciones `, err.message);
    next(err);
  }
});

module.exports = router;