const express = require('express');
const router = express.Router();
const buscarNovedad = require('../services/buscar-novedad');


router.get('/tipo/:cadena', async function(req, res, next) {/*Modificar para que traiga el tipo*/
  try {
    res.json(await buscarNovedad.getTipo(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer las novedades por su tipo`, err.message);
    next(err);
  }
});

router.get('/:cadena', async function(req, res, next) {/*Modificar para que traiga el tipo*/
  try {
    res.json(await buscarNovedad.getMultiple(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer las novedades`, err.message);
    next(err);
  }
});

router.get('/articulo/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarNovedad.getArticulos(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer las novedades de tipo Articulos`, err.message);
    next(err);
  }
});

router.get('/articulocolombiano/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarNovedad.getArticulosColombianos(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer las novedades de tipo Articulos colombianos`, err.message);
    next(err);
  }
});

router.get('/revista/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarNovedad.getRevistas(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer las novedades de tipo Revistas`, err.message);
    next(err);
  }
});


router.get('/noticia/:cadena', async function(req, res, next) {
  try {
    res.json(await buscarNovedad.getNoticias(req.query.page,req.params.cadena));
  } catch (err) {
    console.error(`Error al traer las novedades de tipo Noticias`, err.message);
    next(err);
  }
});

module.exports = router;