const express = require('express');
const router = express.Router();
const resenasGranja = require('../services/resenas-granja');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await resenasGranja.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer las reseñas de la granja `, err.message);
    next(err);
  }
});


module.exports = router;