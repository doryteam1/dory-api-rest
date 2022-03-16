const express = require('express');
const router = express.Router();
const usuario = require('../services/usuario');


router.get('/:id', async function(req, res, next) {
  try {
    res.json(await usuario.getMultiple(req.query.page,req.params.id));
  } catch (err) {
    console.error(`Error al traer el usuario`, err.message);
    next(err);
  }
});


router.put('/update/password', async function(req, res, next) {
  try {
    res.json(await usuario.updatePassword(req.body));
  } catch (err) {
    console.error(`Error al actualizar la contraseña del usuario`, err.message);
    next(err);
  }
});

router.post('/recover/password', async function(req, res, next) {
  try {
    res.json(await usuario.recoverPassword(req.body));
  } catch (err) {
    console.error(`Error al recuperar la contraseña del usuario`, err.message);
    next(err);
  }
});

router.put('/change/password', async function(req, res, next) {
  try {
        var token=req.headers.authorization;
        res.json(await usuario.changePassword(req.body,token));
  } catch (err) {
        console.error(`Error al modificar la contraseña del usuario`, err.message);
        next(err);
  }
});

module.exports = router;