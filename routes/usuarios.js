const express = require('express');
const router = express.Router();
const usuarios = require('../services/usuarios');


router.get('/', async function(req, res, next) {
  try {
    res.json(await usuarios.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer los usuarios`, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
    try {
      res.json(await usuarios.create(req.body));
    } catch (err) {
      console.error(`Error al registrar el usuario`, err.message);
      next(err);
    }
  });

router.put('/total/:id', async function(req, res, next) {
    try {
      res.json(await usuarios.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar el usuario`, err.message);
      next(err);
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await usuarios.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar el usuario`, err.message);
      next(err);
    }
  });

  router.put('/parcial/:id', async function(req, res, next) {
    try {
      res.json(await usuarios.updateParcialUsuario(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar el usuario`, err.message);
      next(err);
    }
  });
 

module.exports = router;