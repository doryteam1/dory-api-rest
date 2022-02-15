const express = require('express');
const router = express.Router();
const usuario = require('../services/usuario');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await usuario.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer el usuario`, err.message);
    next(err);
  }
});


module.exports = router;