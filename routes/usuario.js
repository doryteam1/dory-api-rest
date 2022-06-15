const express = require('express');
const router = express.Router();
const usuario = require('../services/usuario');


router.get('/id/:idUser', async function(req, res, next) {
  try {
    res.json(await usuario.getUserId(req.query.page,req.params.idUser));
  } catch (err) {
    console.error(`Error al traer el usuario`, err.message);
    next(err);
  }
});

router.get('/all', async function(req, res, next) {
  try {
    res.json(await usuario.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error al traer los usuarios`, err.message);
    next(err);
  }
});/*De usuarios Múltiples */

router.post('/create', async function(req, res, next) {
  try {
    res.json(await usuario.create(req.body));
  } catch (err) {
    console.error(`Error al registrar el usuario`, err.message);
    next(err);
  }
});/*De usuarios create */

router.put('/total/:idUser', async function(req, res, next) {
  try {
    res.json(await usuario.update(req.params.idUser, req.body));
  } catch (err) {
    console.error(`Error al actualizar el usuario`, err.message);
    next(err);
  }
});/*De usuarios update */

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

router.put('/parcial/:idUser', async function(req, res, next) {
  try {
    res.json(await usuario.updateParcialUsuario(req.params.idUser, req.body));
  } catch (err) {
    console.error(`Error al actualizar el usuario`, err.message);
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

router.put('/verify/account', async function(req, res, next) {
  try {
        res.json(await usuario.verifyAccount(req.body));
  } catch (err) {
        console.error(`Error al verificar el usuario por el email`, err.message);
        next(err);
  }
});

router.delete('/:idUser', async function(req, res, next) {
  try {
    res.json(await usuario.remove(req.params.idUser));
  } catch (err) {
    console.error(`Error al borrar el usuario`, err.message);
    next(err);
  }
});

router.get('/misconsumos', async function(req, res, next) {
  try {
        var token=req.headers.authorization;
        res.json(await usuario.misConsumos(token));
  } catch (err) {
        console.error(`Error al mostrar los consumos del usuario`, err.message);
        next(err);
  }
});

module.exports = router;