const express = require('express');
const router = express.Router();
const granjas = require('../services/granjas');

router.get('/:id', async function(req, res, next) {
  try {
    res.json(await granjas.getGranjaUsuario(req.query.page, req.params.id));
  } catch (err) {
    console.error(`Error al traer las granjas de éste usuario`, err.message);
    next(err);
  }
});

router.get('/', async function(req, res, next) {
  try {
    res.json(await granjas.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer las granjas `, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
    try {
          var token=req.headers.authorization;
          res.json(await granjas.create(req.body,token));
    } catch (err) {
          console.error(`Error creando la granja`, err.message);
          next(err);
    }
  });

router.put('/general/:id', async function(req, res, next) {
    try {
         var token=req.headers.authorization;
         res.json(await granjas.update(req.params.id, req.body,token));
    } catch (err) {
         console.error(`Error al actualizar la granja`, err.message);
         next(err);
    }
});

router.put('/anular/:id', async function(req, res, next) {
    try { 
         var token=req.headers.authorization;
         res.json(await granjas.anularGranja(req.params.id,token));
    } catch (err) {
         console.error(`Error al borrar la granja`, err.message);
         next(err);
    }
  });

module.exports = router;