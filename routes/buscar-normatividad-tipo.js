const express = require('express');
const router = express.Router();
const buscarNormatividadTipo = require('../services/buscar-normatividad-tipo');


router.get('/:tipo', async function(req, res, next) {
  try {
    res.json(await buscarNormatividadTipo.getMultiple(req.query.page,req.params.tipo));
  } catch (err) {
    console.error(`Error al traer las normatividades por tipo`, err.message);
    next(err);
  }
});


module.exports = router;