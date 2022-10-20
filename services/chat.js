const db = require('./db');
const helper = require('../helper');
var createError = require('http-errors');
const { validarToken } = require('../middelware/auth');
const dayjs = require('dayjs');


async function createMessage(message, token) {
  if (token && validarToken(token)) {
    const payload = helper.parseJwt(token);
    message.usuario_emisor_id = payload.sub;
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    message.fecha_creacion = timestamp;
    console.log("timestamp ",timestamp)
    console.log("fecha creacion mensaje",dayjs(timestamp))
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
      if (result['affectedRows']) {
        console.log("mensaje guardado")
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
}/*End createMessage*/


async function getMensajesPrivados(token, idUser2) {
            if(token && validarToken(token)){
                    const payload=helper.parseJwt(token);  
                    const idUser1=payload.sub;
                    const rows = await db.query(
                      `SELECT *
                      FROM mensajes as m
                      WHERE (m.usuario_emisor_id=? and m.usuario_receptor_id=?) || (m.usuario_emisor_id=? and m.usuario_receptor_id=?)
                      order by fecha_creacion desc`, 
                      [idUser1, idUser2, idUser2, idUser1]
                    );
                    let data;
                    if(rows.length<1){
                      data = {
                        mensajes:[]
                      }
                      return {
                        data
                      }
                    }
                    data = helper.emptyOrRows(rows);
                    return {data};                
            }else{
                  throw createError(401,"Usted no tiene autorización"); 
            }
}/*End getMensajesPrivados*/


module.exports = {
  createMessage,
  getMensajesPrivados
}