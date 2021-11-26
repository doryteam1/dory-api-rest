const express = require('express');
const router = express.Router();
const informeGranjasDepartamento = require('../services/informes-granjas-departamento');


router.get('/', async function(req, res, next) {
  try {
    res.json(await informeGranjasDepartamento.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer los infromes de Granjas por Departamento `, err.message);
    next(err);
  }
});

module.exports = router;