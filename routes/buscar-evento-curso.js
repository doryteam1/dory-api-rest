const express = require('express');
const router = express.Router();
const buscarEventoCurso = require('../services/buscar-evento-curso');


router.get('/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarEventoCurso.getMultiple(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer los Eventos Cursos`, err.message);
    next(err);
  }
});


module.exports = router;