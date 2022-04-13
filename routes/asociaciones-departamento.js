const express = require('express');
const router = express.Router();
const asociacionesDepartamento = require('../services/asociaciones-departamento');

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

router.get('/:id', async function(req, res, next) {
  try {
    res.json(await asociacionesDepartamento.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer las asociaciones del departamento`, err.message);
    next(err);
  }
});

module.exports = router;