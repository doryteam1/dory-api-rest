const express = require('express');
const router = express.Router();
const proyectos_municipios = require('../services/proyectos_municipios');


router.get('/', async function(req, res, next) {
  try {
    res.json(await proyectos_municipios.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer los proyectos al municipio`, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await proyectos_municipios.create(req.body));
    } catch (err) {
      console.error(`Error creando el proyecto al municipio`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await proyectos_municipios.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar el proyecto al municipio`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await proyectos_municipios.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar el proyecto al municipio`, err.message);
      next(err);
    }
  });

module.exports = router;