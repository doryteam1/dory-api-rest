const express = require('express');
const router = express.Router();
const especies_usuarios = require('../services/especies_usuarios');


router.get('/', async function(req, res, next) {
  try {
    res.json(await especies_usuarios.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer las especies de usuarios`, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await especies_usuarios.create(req.body));
    } catch (err) {
      console.error(`Error creando la especie de usuario`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await especies_usuarios.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar la especie de usuario`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await especies_usuarios.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar la especie de usuario`, err.message);
      next(err);
    }
  });

module.exports = router;