const express = require('express');
const router = express.Router();
const sliders = require('../services/sliders');

router.get('/obtener', async function(req, res, next) {
  try {
    res.json(await sliders.obtenerSlid());
  } catch (err) {
    console.error(`Error al obtener los slid`, err.message);
    next(err);
  }
});

router.post('/crear', async function(req, res, next) {
  try {
    var token=req.headers.authorization;
    res.json(await sliders.crearSlid(req.body,token));
  } catch (err) {
    console.error(`Error al crear el slider`, err.message);
    next(err);
  }
});

router.put('/actualizar/:idSlide', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await sliders.actualizarSlid(req.params.idSlide,req.body,token));
    } catch (err) {
      console.error(`Error al actualizar el slider`, err.message);
      next(err);
    }
});

router.delete('/delete/slide/:idSlide', async function(req, res, next) {
  try {
    var token=req.headers.authorization;
    res.json(await sliders.eliminarSlid(req.params.idSlide,token));
  } catch (err) {
    console.error(`Error al eliminar el slid`, err.message);
    next(err);
  }
});

router.put('/update/carrusel/sliders', async function(req, res, next) {
  try {
    var token=req.headers.authorization;
    res.json(await sliders.actualizarCarruselSlid(req.body,token));
  } catch (err) {
    console.error(`Error al actualizar los slider`, err.message);
    next(err);
  }
});

router.put('/update/parcial/slide/:idSlide', async function(req, res, next) {
  try {
    var token=req.headers.authorization;
    res.json(await sliders.updateParcialSlid(req.params.idSlide,req.body,token));
  } catch (err) {
    console.error(`Error al actualizar parcialmente el slid`, err.message);
    next(err);
  }
});

router.put('/update/time/slider', async function(req, res, next) {
  try {
    var token=req.headers.authorization;
    res.json(await sliders.updateTimeSlider(req.body,token));
  } catch (err) {
    console.error(`Error al actualizar el tiempo del slider`, err.message);
    next(err);
  }
});

module.exports = router;