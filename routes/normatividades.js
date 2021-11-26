const express = require('express');
const router = express.Router();
const normatividades = require('../services/normatividades');


router.get('/', async function(req, res, next) {
  try {
    res.json(await normatividades.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer las normatividades`, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await normatividades.create(req.body));
    } catch (err) {
      console.error(`Error registrando normatividad`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await normatividades.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar normatividad`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await normatividades.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar normatividad`, err.message);
      next(err);
    }
  });

module.exports = router;