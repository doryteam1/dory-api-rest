const express = require('express');
const router = express.Router();
const pescadoresDepartamento = require('../services/pescadores-departamento');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await pescadoresDepartamento.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer los Pescadores del departamento`, err.message);
    next(err);
  }
});

module.exports = router;