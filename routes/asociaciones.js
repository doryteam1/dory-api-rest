const express = require('express');
const router = express.Router();
const asociaciones = require('../services/asociaciones');

router.get('/usuario/:id_user', async function(req, res, next) {
  try {
    res.json(await asociaciones.getMultiple(req.query.page,req.params.id_user));
  } catch (err) {
    console.error(`Error al traer las asociaciones `, err.message);
    next(err);
  }
});

router.get('/detail/:nit', async function(req, res, next) {
  try {
          var token=req.headers.authorization;
          res.json(await asociaciones.getDetail(req.params.nit,token));
  } catch (err) {
          console.error(`Error al traer las asociaciones `, err.message);
          next(err);
  }
});

/**
* @swagger
* components:
*  schemas:
*    asociaciones-departamento:
*         type: object
*         properties:
*           id_municipio:
*              type: integer
*              description: Identificador del municipio
*           nombre:
*              type: string
*              description: Nombre del municipio
*           poblacion:
*              type: integer    
*              description: Número de habitantes en el municipio
*           count_asociaciones:
*              type: string
*              description: Cantidad de asociaciones en el municipio
*/       

/**
 * @swagger
 * /api/asociaciones/departamento/{id}:
 *   get:
 *     summary: Retorna todas las asociaciones del departamento
 *     tags: 
 *     - asociaciones-departamentos 
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *            type: string
 *         required: true
 *         description: Id del departamento donde se encuentran las asociaciones     
 *     responses:
 *       200:
 *         description: Obtención de las asociaciones en el departamento
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/asociaciones-departamento'
 *       404:
 *         description: Asociaciones del departamento No encontradas 
 *       500:
 *         description: Error al retornar las asociaciones del departamento
 */

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
    console.error(`Error al traer las asociaciones del departamento`, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
    try {
      var token=req.headers.authorization;
      res.json(await asociaciones.create(req.body,token));
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
        res.json(await asociaciones.ObtenerTodasAsociaciones(req.query.page));
  } catch (err) {
        console.error(`Error al retornar todas las asociaciones`, err.message);
        next(err);
  }
});

module.exports = router;