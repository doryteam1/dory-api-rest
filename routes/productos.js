const express = require('express');
const router = express.Router();
const productos = require('../services/productos');


router.get('/proveedor/:id', async function(req, res, next) {
  try {
    res.json(await productos.getMultiple(req.query.page, req.params.id));
  } catch (err) {
    console.error(`Error al traer los productos del usuario proveedor ingresado`, err.message);
    next(err);
  }
});


router.post('/proveedor/', async function(req, res, next) {
    try {
              var token=req.headers.authorization;
              res.json(await productos.create(req.body,token));
    } catch (err) {
            console.error(`Error creando el producto del usuario`, err.message);
            next(err);
    }
  });


router.put('/proveedor/:id', async function(req, res, next) {
    try {
          var token=req.headers.authorization;
          res.json(await productos.update(req.params.id, req.body,token));
    } catch (err) {
          console.error(`Error al actualizar el producto del usuario`, err.message);
          next(err);
    }
});


router.delete('/proveedor/:id', async function(req, res, next) {
    try {
          var token=req.headers.authorization;
          res.json(await productos.remove(req.params.id,token));
    } catch (err) {
          console.error(`Error al borrar el producto del usuario`, err.message);
          next(err);
    }
  });

module.exports = router;