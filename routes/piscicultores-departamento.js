const express = require('express');
const router = express.Router();
const piscicultoresDepartamento = require('../services/piscicultores-departamento');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await piscicultoresDepartamento.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer los Piscicultores del departamento`, err.message);
    next(err);
  }
});

module.exports = router;