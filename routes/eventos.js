const express = require('express');
const router = express.Router();
const eventos = require('../services/eventos');


router.get('/', async function(req, res, next) {
  try {
    res.json(await eventos.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer los eventos`, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await eventos.create(req.body));
    } catch (err) {
      console.error(`Error creando el evento`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await eventos.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar el evento`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await eventos.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar el evento`, err.message);
      next(err);
    }
  });

module.exports = router;