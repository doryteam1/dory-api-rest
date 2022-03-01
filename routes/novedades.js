const express = require('express');
const router = express.Router();
const novedades = require('../services/novedades');


router.get('/', async function(req, res, next) {
  try {
       var token = req.headers.authorization.split(" ")[1];
        res.json(await novedades.getMultiple(req.query.page,token));
  } catch (err) {
    console.error(`Error al traer las novedades.`, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await novedades.create(req.body));
    } catch (err) {
      console.error(`Error registrando la novedad.`, err.message);
      next(err);
    }
  });


router.put('/total/:id', async function(req, res, next) {
    try {
      res.json(await novedades.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar la novedad.`, err.message);
      next(err);
    }
});


router.delete('/general/:id', async function(req, res, next) {
    try {
      res.json(await novedades.remove(req.params.id));
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

router.post('/like/', async function(req, res, next) {
  try {
    res.json(await novedades.agregarLikes(req.body));
  } catch (err) {
    console.error(`Error al agregar like a la novedad.`, err.message);
    next(err);
  }
});

router.delete('/dislike/', async function(req, res, next) {
  try {
    res.json(await novedades.eliminarLikes(req.body));
  } catch (err) {
    console.error(`Error al eliminar like a novedad.`, err.message);
    next(err);
  }
});


module.exports = router;