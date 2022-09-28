const express = require('express');
const router = express.Router();
const novedades = require('../services/novedades');

router.get('/', async function(req, res, next) {
  try {
       var token=req.headers.authorization;
       res.json(await novedades.getMultiple(req.query.page,token));
  } catch (err) {
    console.error(`Error al traer las novedades.`, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await novedades.create(req.body,token));
    } catch (err) {
      console.error(`Error registrando la novedad.`, err.message);
      next(err);
    }
  });

router.put('/total/:id', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await novedades.update(req.params.id, req.body,token));
    } catch (err) {
      console.error(`Error al actualizar la novedad.`, err.message);
      next(err);
    }
});

router.delete('/general/:id', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await novedades.remove(req.params.id,token));
    } catch (err) {
      console.error(`Error al borrar la novedad.`, err.message);
      next(err);
    }
  });
  
  router.put('/visitas/:id', async function(req, res, next) {
    try {
      res.json(await novedades.updateVisitas(req.params.id));
    } catch (err) {
      console.error(`Error al actualizar la visita de la novedad.`, err.message);
      next(err);
    }
});

router.get('/detailed/:idNovedad', async function(req, res, next) {
  try {    
    res.json(await novedades.getDetailNovedad(req.params.idNovedad));
  } catch (err) {
    console.error(`Error al traer la novedad detallada `, err.message);
    next(err);
  }
});

module.exports = router;