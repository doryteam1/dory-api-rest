const express = require('express');
const router = express.Router();
const municipios = require('../services/municipios');


router.get('/', async function(req, res, next) {
  try {
    res.json(await municipios.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer los municipios `, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await municipios.create(req.body));
    } catch (err) {
      console.error(`Error creando el municipio`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await municipios.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar el municipio`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await municipios.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar el municipio`, err.message);
      next(err);
    }
  });

module.exports = router;