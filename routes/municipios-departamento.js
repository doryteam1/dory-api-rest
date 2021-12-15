const express = require('express');
const router = express.Router();
const municipiosDepartamento = require('../services/municipios-departamento');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await municipiosDepartamento.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer los municipios del departamento `, err.message);
    next(err);
  }
});

module.exports = router;