const express = require('express');
const router = express.Router();
const pescadoresAsociacion = require('../services/pescadores-asociacion');


router.get('/:nit', async function(req, res, next) {
  try {
    res.json(await pescadoresAsociacion.getMultiple(req.query.page,req.params.nit));
  } catch (err) {
    console.error(`Error al traer los Pescadores de las asociaciones `, err.message);
    next(err);
  }
});

module.exports = router;