const express = require('express');
const router = express.Router();
const asociacionesDepartamento = require('../services/asociaciones-departamento');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await asociacionesDepartamento.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer las asociaciones del departamento`, err.message);
    next(err);
  }
});

module.exports = router;