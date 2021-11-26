const express = require('express');
const router = express.Router();
const proyectos_departamentos = require('../services/proyectos_departamentos');


router.get('/', async function(req, res, next) {
  try {
    res.json(await proyectos_departamentos.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer los proyectos al departamento`, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await proyectos_departamentos.create(req.body));
    } catch (err) {
      console.error(`Error creando el proyecto al departamento`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await proyectos_departamentos.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar el proyecto al departamento`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await proyectos_departamentos.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar el proyecto al departamento`, err.message);
      next(err);
    }
  });

module.exports = router;