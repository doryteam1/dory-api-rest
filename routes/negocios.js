const express = require('express');
const router = express.Router();
const negocios = require('../services/negocios');

router.get('/usuario/:idUser', async function(req, res, next) {
  try {  
    res.json(await negocios.getNegocioUsuario(req.query.page, req.params.idUser));
  } catch (err) {
    console.error(`Error al traer los negocios de éste usuario`, err.message);
    next(err);
  }
});

router.get('/', async function(req, res, next) {
  try {
    res.json(await negocios.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer los negocios `, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
    try {
          var token=req.headers.authorization;
          res.json(await negocios.createNegocio(req.body,token));
    } catch (err) {
          console.error(`Error creando el negocio`, err.message);
          next(err);
    }
  });

router.put('/update/:idNegocio', async function(req, res, next) {
    try {
         var token=req.headers.authorization;
         res.json(await negocios.updateNegocio(req.params.idNegocio, req.body,token));
    } catch (err) {
         console.error(`Error al actualizar el negocio`, err.message);
         next(err);
    }
});

  router.delete('/eliminar/:idNegocio', async function(req, res, next) {
    try { 
         var token=req.headers.authorization;  
         res.json(await negocios.eliminarNegocio(req.params.idNegocio,token));
    } catch (err) {
         console.error(`Error al borrar el negocio`, err.message);
         next(err);
    }
  });

module.exports = router;