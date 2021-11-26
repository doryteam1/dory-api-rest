const express = require('express');
const router = express.Router();
const asociaciones = require('../services/asociaciones');


router.get('/', async function(req, res, next) {
  try {
    res.json(await asociaciones.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer las asociaciones `, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await asociaciones.create(req.body));
    } catch (err) {
      console.error(`Error creando la asociación`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await asociaciones.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar la asociación`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await asociaciones.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar la asociación`, err.message);
      next(err);
    }
  });

module.exports = router;