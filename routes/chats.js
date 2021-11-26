const express = require('express');
const router = express.Router();
const chats = require('../services/chats');


router.get('/', async function(req, res, next) {
  try {
    res.json(await chats.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer los chats`, err.message);
    next(err);
  }
});


router.post('/', async function(req, res, next) {
    try {
      res.json(await chats.create(req.body));
    } catch (err) {
      console.error(`Error creando el chat`, err.message);
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await chats.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar el chat`, err.message);
      next(err);
    }
});


router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await chats.remove(req.params.id));
    } catch (err) {
      console.error(`Error al borrar el chat`, err.message);
      next(err);
    }
  });

module.exports = router;