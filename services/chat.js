const db = require('./db');
const helper = require('../helper');
var createError = require('http-errors');
const { validarToken } = require('../middelware/auth');
const dayjs = require('dayjs');


async function createMessage(message, token) {
  if (token && validarToken(token)) {
    const payload = helper.parseJwt(token);
    message.usuario_emisor_id = payload.sub;
    var now = dayjs()
    message.fecha_creacion = 343543543;
    console.log("fecha creacion mensaje",dayjs(now))
    try {
      if (message.contenido === undefined ||
        message.usuario_receptor_id === undefined ||
        message.tipo_mensaje_id === undefined ||
        message.grupos_id === undefined
      ) {
        throw createError(400, "Se requieren todos los parámetros!");
      }

      console.log("message ",message)
      const result = await db.query(
        `INSERT INTO mensajes(contenido,fecha_creacion,usuario_emisor_id,usuario_receptor_id,tipo_mensaje_id,grupos_id) VALUES (?,?,?,?,?,?)`,
        [
          message.contenido,
          message.fecha_creacion,
          message.usuario_emisor_id,
          message.usuario_receptor_id,
          message.tipo_mensaje_id,
          message.grupos_id
        ]
      );
      console.log("result ",result)
      if (result[0]['affectedRows']) {
        return { message: 'mensaje guardado' };
      }else{
        return { message: 'error guardando mensaje' }
      }
    } catch (error) {
      throw error;
    }
  } else {
    throw createError(401, "Usted no tiene autorización");
  }
}



module.exports = {
  createMessage,
}