const express = require('express');
const router = express.Router();
const areas_experticias = require('../services/areas_experticias');


router.get('/', async function(req, res, next) {
  try {
    res.json(await areas_experticias.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer las areas_experticias`, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await areas_experticias.create(req.body));
    } catch (err) {
      console.error(`Error creando area de experticia`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await areas_experticias.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar area de experticia`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await areas_experticias.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar area de experticia`, err.message);
      next(err);
    }
  });

module.exports = router;