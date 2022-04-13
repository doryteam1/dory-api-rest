const express = require('express');
const router = express.Router();
const resenas = require('../services/resenas');


router.get('/granja/:idGranja', async function(req, res, next) {
  try {
    res.json(await resenas.getResenasGranja(req.query.page,req.params.idGranja));
  } catch (err) {
    console.error(`Error al traer las reseñas de la granja `, err.message);
    next(err);
  }
});

router.get('/', async function(req, res, next) {
  try {
    res.json(await resenas.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer las resenas del usuario con las asociaciones  `, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await resenas.create(req.body));
    } catch (err) {
      console.error(`Error creando la reseña del usuario con la asociación`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await resenas.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar la reseña del usuario con la asociacion`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await resenas.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar la reseña del usuario con la asociacion`, err.message);
      next(err);
    }
  });

module.exports = router;