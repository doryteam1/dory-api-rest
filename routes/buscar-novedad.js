const express = require('express');
const router = express.Router();
const buscarNovedad = require('../services/buscar-novedad');


router.get('/tipo/:cadena', async function(req, res, next) {/*Modificar para que traiga el tipo*/
  try {
       var token=undefined;
      if(req.headers.authorization){
          token = req.headers.authorization.split(" ")[1];
      }
     res.json(await buscarNovedad.getTipo(req.query.page,req.params.cadena,token));
  } catch (err) {
    console.error(`Error al traer las novedades por su tipo`, err.message);
    next(err);
  }
});

router.get('/:cadena', async function(req, res, next) {/*Modificar para que traiga el tipo*/
  try {
        var token=undefined;
        if(req.headers.authorization){
           token = req.headers.authorization.split(" ")[1];
        }
       res.json(await buscarNovedad.getMultiple(req.query.page,req.params.cadena,token));
  } catch (err) {
    console.error(`Error al traer las novedades`, err.message);
    next(err);
  }
});

router.get('/articulo/:cadena', async function(req, res, next) {
  try {
        token = req.headers.authorization;
        res.json(await buscarNovedad.getArticulos(req.query.page,req.params.cadena,token));
  } catch (err) {
    console.error(`Error al traer las novedades de tipo Articulos`, err.message);
    next(err);
  }
});

router.get('/articulo-colombia/:cadena', async function(req, res, next) {
  try {
        var token=undefined;
        if(req.headers.authorization){
          token = req.headers.authorization.split(" ")[1];
        }
        res.json(await buscarNovedad.getArticulosColombianos(req.query.page,req.params.cadena,token));
  } catch (err) {
    console.error(`Error al traer las novedades de tipo Articulos colombianos`, err.message);
    next(err);
  }
});

router.get('/revista/:cadena', async function(req, res, next) {
  try {
        var token=undefined;
        if(req.headers.authorization){
          token = req.headers.authorization.split(" ")[1];
        }
        res.json(await buscarNovedad.getRevistas(req.query.page,req.params.cadena,token));
  } catch (err) {
    console.error(`Error al traer las novedades de tipo Revistas`, err.message);
    next(err);
  }
});


router.get('/noticia/:cadena', async function(req, res, next) {
  try {
        var token=undefined;
       if(req.headers.authorization){
            token = req.headers.authorization.split(" ")[1];
       }
       res.json(await buscarNovedad.getNoticias(req.query.page,req.params.cadena,token));
  } catch (err) {
    console.error(`Error al traer las novedades de tipo Noticias`, err.message);
    next(err);
  }
});

module.exports = router;