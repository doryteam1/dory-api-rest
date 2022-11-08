const express = require('express');
const router = express.Router();
const topalert = require('../services/topalert');

router.get('/', async function(req, res, next) {
  try {
    res.json(await topalert.getTopAlert());
  } catch (err) {
    console.error(`Error al obtener el top alert`, err.message);
    next(err);
  }
});

router.put('/', async function(req, res, next) {
  try {
    var token=req.headers.authorization;
    res.json(await topalert.updateTopAlert(req.body,token));
  } catch (err) {
    console.error(`Error al actualizar el top alert`, err.message);
    next(err);
  }
});

router.put('/parcial/:idTopAlert', async function(req, res, next) {
  try {
    var token=req.headers.authorization;
    res.json(await topalert.updateParcialTopAlert(req.params.idTopAlert,req.body,token));
  } catch (err) {
    console.error(`Error al actualizar el top alert`, err.message);
    next(err);
  }
});

module.exports = router;