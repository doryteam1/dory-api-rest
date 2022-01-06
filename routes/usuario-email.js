const express = require('express');
const router = express.Router();
const usuarioEmail = require('../services/usuario-email');


router.get('/:email', async function(req, res, next) {
  try {
    res.json(await usuarioEmail.getMultiple(req.query.page,req.params.email));
  } catch (err) {
    console.error(`Error al traer el usuario por su email`, err.message);
    next(err);
  }
});


module.exports = router;