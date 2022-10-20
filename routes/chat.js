const express = require('express');
const router = express.Router();
const areas_experticias = require('../services/areas_experticias');

router.get('/mensajes/privados/:idUser2', async function(req, res, next) {
  try {
        var token=req.headers.authorization;
        res.json(await areas_experticias.getMensajesPrivados(token, req.params.idUser2));
  } catch (err) {
    console.error(`Error al traer las areas_experticias`, err.message);
    next(err);
  }
});

module.exports = router;