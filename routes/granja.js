const express = require('express');
const router = express.Router();
const granja = require('../services/granja');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await granja.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer la granja `, err.message);
    next(err);
  }
});


module.exports = router;