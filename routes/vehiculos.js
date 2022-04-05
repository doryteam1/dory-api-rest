const express = require('express');
const router = express.Router();
const vehiculos = require('../services/vehiculos');


router.get('/', async function(req, res, next) {
  try {
    res.json(await vehiculos.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer los vehiculos `, err.message);
    next(err);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    res.json(await vehiculos.getVehiculoUser(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer los vehiculos `, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await vehiculos.create(req.body,token));
    } catch (err) {
      console.error(`Error creando el vehiculo`, err.message);
      next(err);
    }
  });

router.put('/:id', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await vehiculos.update(req.params.id, req.body,token));
    } catch (err) {
      console.error(`Error al actualizar el vehiculo`, err.message);
      next(err);
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await vehiculos.remove(req.params.id,token));
    } catch (err) {
      console.error(`Error al borrar el vehiculo`, err.message);
      next(err);
    }
  });

module.exports = router;