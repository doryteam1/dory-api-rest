const express = require('express');
const router = express.Router();
const asociaciones_usuarios = require('../services/asociaciones_usuarios');


router.get('/', async function(req, res, next) {
  try {
    res.json(await asociaciones_usuarios.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer las asociaciones de los usuarios `, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await asociaciones_usuarios.create(req.body));
    } catch (err) {
      console.error(`Error creando la asociación del usuario`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await asociaciones_usuarios.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar la asociación del usuario`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await asociaciones_usuarios.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar la asociación del usuario`, err.message);
      next(err);
    }
  });

module.exports = router;