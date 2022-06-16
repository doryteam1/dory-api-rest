const express = require('express');
const router = express.Router();
const asociaciones = require('../services/asociaciones');

router.get('/', async function(req, res, next) {
  try {
    res.json(await asociaciones.getMultiple(req.query.page));
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

router.post('/', async function(req, res, next) {
    try {
      res.json(await asociaciones.create(req.body));
    } catch (err) {
      console.error(`Error creando la asociación`, err.message);
      next(err);
    }
  });


router.put('/:nit', async function(req, res, next) {
    try {
      res.json(await asociaciones.update(req.params.nit, req.body));
    } catch (err) {
      console.error(`Error al actualizar la asociación`, err.message);
      next(err);
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await asociaciones.remove(req.params.id));
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

router.delete('/solicitud/eliminar/:nit', async function(req, res, next) {
  try {
    var token=req.headers.authorization;
    res.json(await asociaciones.removeSolicitudAdicion(req.params.nit, token));
  } catch (err) {
    console.error(`Error al eliminar la solicitud de la asociación`, err.message);
    next(err);
  }
});

module.exports = router;