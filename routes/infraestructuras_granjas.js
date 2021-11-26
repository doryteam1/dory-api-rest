const express = require('express');
const router = express.Router();
const infraestructuras_granjas = require('../services/infraestructuras_granjas');


router.get('/', async function(req, res, next) {
  try {
    res.json(await infraestructuras_granjas.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer las infraestructuras de la granja`, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await infraestructuras_granjas.create(req.body));
    } catch (err) {
      console.error(`Error creando la infraestructura de la granja`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await infraestructuras_granjas.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar la infraestructura de la granja`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await infraestructuras_granjas.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar la infraestructura de la granja`, err.message);
      next(err);
    }
  });

module.exports = router;