const express = require('express');
const router = express.Router();
const enviarFormulario = require('../services/enviarFormulario');


router.post('/', async function(req, res, next) {
  try {
         res.json(await enviarFormulario.enviarFormulario(req.body));
      } catch (err) {
         console.error(`Error al enviar los datos del formulario`, err.message);
    next(err);
  }
});

module.exports = router;