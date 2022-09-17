const express = require('express');
const router = express.Router();
const asociaciones = require('../services/asociaciones');

router.get('/usuario/:id_user', async function(req, res, next) {
  try {
    res.json(await asociaciones.getAsociacionesUser(req.query.page,req.params.id_user));
  } catch (err) {
    console.error(`Error al traer las asociaciones `, err.message);
    next(err);
  }
});

router.get('/detail/:nit', async function(req, res, next) {
  try {
          var token=req.headers.authorization;
          res.json(await asociaciones.getDetailAsociacion(req.params.nit,token));
  } catch (err) {
          console.error(`Error al traer las asociaciones `, err.message);
          next(err);
  }
});

router.get('/departamento/:idDepartamento', async function(req, res, next) {
  try {
    res.json(await asociaciones.getAsociacionesDepartamento(req.query.page,req.params.idDepartamento));
  } catch (err) {
    console.error(`Error al traer las asociaciones del departamento`, err.message);
    next(err);
  }
});

router.get('/municipio/:idMunic', async function(req, res, next) {
  try {
    res.json(await asociaciones.getAsociacionesMunicipio(req.query.page,req.params.idMunic));
  } catch (err) {
    console.error(`Error al traer las asociaciones del municipio`, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await asociaciones.createAsociacion(req.body,token));
    } catch (err) {
      console.error(`Error creando la asociación`, err.message);
      next(err);
    }
  });

router.put('/:nit', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await asociaciones.update(req.params.nit, req.body,token));
    } catch (err) {
      console.error(`Error al actualizar la asociación`, err.message);
      next(err);
    }
});

router.delete('/:nit', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await asociaciones.remove(req.params.nit,token));
    } catch (err) {
      console.error(`Error al borrar la asociación`, err.message);
      next(err);
    }
  });

  router.post('/solicitud/adicion/:nit', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await asociaciones.enviarSolicitudAdicion(req.params.nit, token,req.body));
    } catch (err) {
      console.error(`Error al enviar la solicitud de adición a la asociación`, err.message);
      next(err);
    }
});

router.delete('/solicitud/eliminar/:idSolicitud', async function(req, res, next) {
  try {
    var token=req.headers.authorization;
    res.json(await asociaciones.removeSolicitudAdicion(req.params.idSolicitud, token));
  } catch (err) {
    console.error(`Error al eliminar la solicitud de la asociación`, err.message);
    next(err);
  }
});

router.get('/solicitudes/noaceptadas', async function(req, res, next) {
  try {
        var token=req.headers.authorization;
        res.json(await asociaciones.getSolicitudesNoaceptadasPorAsociacion(token));
  } catch (err) {
        console.error(`Error al retornar las solicitudes no aceptadas por la asociación`, err.message);
        next(err);
  }
});

router.put('/aceptarSolicitudAsociacion/:idSolicitud', async function(req, res, next) {
  try {
    var token=req.headers.authorization;
    res.json(await asociaciones.aceptarSolicitudAsociacion(req.params.idSolicitud,token));
  } catch (err) {
    console.error(`Error al actualizar la solicitud`, err.message);
    next(err);
  }
});

router.get('/miembros/:idUser', async function(req, res, next) {
  try {
        var token=req.headers.authorization;
        res.json(await asociaciones.getAsociacionesMiembros(req.query.page, req.params.idUser));
  } catch (err) {
        console.error(`Error al retornar las asociaciones de las que es miembro el usuario`, err.message);
        next(err);
  }
});

router.get('/todas', async function(req, res, next) {
  try {
        var token=req.headers.authorization;
        res.json(await asociaciones.ObtenerTodasAsociaciones(req.query.page,token));
  } catch (err) {
        console.error(`Error al retornar todas las asociaciones`, err.message);
        next(err);
  }
});

router.get('/granjas/asociadas/:nit', async function(req, res, next) {
  try {
       var token=req.headers.authorization;
        res.json(await asociaciones.ObtenerTodasGranjasAsociadas(req.params.nit,token));
  } catch (err) {
        console.error(`Error al retornar todas las granjas asociadas a la asociación ingreasada`, err.message);
        next(err);
  }
});

module.exports = router;