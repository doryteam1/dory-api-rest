const express = require('express');
const router = express.Router();
const normatividadTipo = require('../services/normatividad-tipo');


router.get('/:tipo', async function(req, res, next) {
  try {
    res.json(await normatividadTipo.getMultiple(req.query.page,req.params.tipo));
  } catch (err) {
    console.error(`Error al traer las normatividades por tipo`, err.message);
    next(err);
  }
});


module.exports = router;