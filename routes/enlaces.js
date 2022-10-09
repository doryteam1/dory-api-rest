const express = require('express');
const router = express.Router();
const enlaces = require('../services/enlaces');

router.get('/obtener', async function(req, res, next) {
  try {
    res.json(await enlaces.obtenerLink(req.query.page));
  } catch (err) {
    console.error(`Error al traer los enlaces de interés`, err.message);
    next(err);
  }
});

router.post('/registrar', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await enlaces.registrarLink(req.body,token));
    } catch (err) {
      console.error(`Error creando el enlace de interés`, err.message);
      next(err);
    }
  });

router.put('/actualizar/:id', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await enlaces.actualizarLink(req.params.id, req.body,token));
    } catch (err) {
      console.error(`Error al actualizar el enlace de interés`, err.message);
      next(err);
    }
});

router.delete('/eliminar/:id', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await enlaces.eliminarLink(req.params.id,token));
    } catch (err) {
      console.error(`Error al borrar el enlace de interés`, err.message);
      next(err);
    }
  });

module.exports = router;