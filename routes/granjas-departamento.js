const express = require('express');
const router = express.Router();
const granjasDepartamento = require('../services/granjas-departamento');


router.get('/', async function(req, res, next) {
  try {
    res.json(await granjasDepartamento.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer las Granjas por Departamento `, err.message);
    next(err);
  }
});

module.exports = router;