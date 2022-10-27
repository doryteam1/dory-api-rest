const express = require('express');
const router = express.Router();
const chat = require('../services/chat');
const { socketController } = require('../sockets/controller')

router.get('/mensajes/privados/:idUser2', async function(req, res, next) {
  try {
        var token=req.headers.authorization;
        res.json(await chat.getMensajesPrivados(token, req.params.idUser2));
  } catch (err) {
    console.error(`Error al traer los mensajes privados del chat`, err.message);
    next(err);
  }
});

router.get('/ultimos/', async function(req, res, next) {
  try {
        var token=req.headers.authorization;
        res.json(await chat.getUltimos(token));
  } catch (err) {
    console.error(`Error al traer los ultimos mensajes`, err.message);
    next(err);
  }
});

router.get('/conected/all', async function(req, res, next) {
  try {
        res.json({data:socketController.getAllConnected()});
  } catch (err) {
    console.error(`Error al traer usuarios activos`, err.message);
    next(err);
  }
});
module.exports = router;