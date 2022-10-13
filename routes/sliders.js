const express = require('express');
const router = express.Router();
const sliders = require('../services/sliders');

router.put('/actualizar/:idSlider', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await sliders.actualizarSlider(req.params.idSlider,req.body,token));
    } catch (err) {
      console.error(`Error al actualizar el slider`, err.message);
      next(err);
    }
});

router.put('/update/carrusel/sliders', async function(req, res, next) {
  try {
    var token=req.headers.authorization;
    res.json(await sliders.actualizarCarruselSliders(req.body,token));
  } catch (err) {
    console.error(`Error al actualizar los slider`, err.message);
    next(err);
  }
});

module.exports = router;