const express = require('express');
const router = express.Router();
const foros = require('../services/foros');

router.get('/obtener/preguntas', async function(req, res, next) {
  try {
    res.json(await foros.getPreguntasForos());
  } catch (err) {
    console.error(`Error al traer las preguntas del foro`, err.message);
    next(err);
  }
});

router.get('/obtener/respuestas/:idpregunta', async function(req, res, next) {
  try {
    res.json(await foros.getRespuestasPregunta(req.params.idpregunta));
  } catch (err) {
    console.error(`Error al traer las respuestas a pregunta del foro`, err.message);
    next(err);
  }
});

router.get('/obtener/todas/respuestas', async function(req, res, next) {
  try {
    res.json(await foros.getTodasRespuestas());
  } catch (err) {
    console.error(`Error al traer las respuestas de todos los foros`, err.message);
    next(err);
  }
});


router.post('/registrar/respuesta', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await foros.registrarRespuesta(req.body, token));
    } catch (err) {
      console.error(`Error al registrar la respuesta de la pregunta del foro`, err.message);
      next(err);
    }
  });

  router.post('/registrar/pregunta', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await foros.registrarPregunta(req.body, token));
    } catch (err) {
      console.error(`Error al registrar la pregunta del foro`, err.message);
      next(err);
    }
  });

/*
router.put('/actualizar/:id', async function(req, res, next) {
    try {
      res.json(await foros.updateForo(req.params.id, req.body));
    } catch (err) {
      console.error(`Error al actualizar foro`, err.message);
      next(err);
    }
});

router.delete('/eliminar/:id', async function(req, res, next) {
    try {
      res.json(await foros.removeAreaForo(req.params.id));
    } catch (err) {
      console.error(`Error al borrar foro`, err.message);
      next(err);
    }
  });
*/
module.exports = router;