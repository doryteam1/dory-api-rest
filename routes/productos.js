const express = require('express');
const router = express.Router();
const productos = require('../services/productos');


router.get('/', async function(req, res, next) {
  try {
    res.json(await productos.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer los productos`, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await productos.create(req.body));
    } catch (err) {
      console.error(`Error creando el producto`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await productos.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar el producto`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await productos.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar el producto`, err.message);
      next(err);
    }
  });

module.exports = router;