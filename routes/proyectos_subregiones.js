const express = require('express');
const router = express.Router();
const proyectos_subregiones = require('../services/proyectos_subregiones');


router.get('/', async function(req, res, next) {
  try {
    res.json(await proyectos_subregiones.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer los proyectos de las subregiones`, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await proyectos_subregiones.create(req.body));
    } catch (err) {
      console.error(`Error creando el proyecto a la subregión`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await proyectos_subregiones.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar el proyecto a la subregión`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await proyectos_subregiones.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar el proyecto a la subregión`, err.message);
      next(err);
    }
  });

module.exports = router;