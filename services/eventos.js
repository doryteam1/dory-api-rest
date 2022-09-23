const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');
/*------------------------------------------------getMultiple---------------------------------------------------*/
async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM eventos LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};
  return {
    data,
    meta
  }
}/*End getMultiple*/

/*------------------------------------------------create---------------------------------------------------*/
async function create(evento,token){
           try{
                if(token && validarToken(token)){
                        let payload=helper.parseJwt(token);
                        let tipo_user= payload.rol; 
                       if(tipo_user!='Administrador'){
                              throw createError(401,"Usted no tiene autorización para registrar eventos");
                       }
                       if(evento.id_evento===undefined ||
                          evento.nombre===undefined || 
                          evento.resumen===undefined || 
                          evento.fecha===undefined ||
                          evento.hora===undefined || 
                          evento.imagen===undefined ||
                          evento.url===undefined ||
                          evento.dirigidoa===undefined || 
                          evento.organizador===undefined || 
                          evento.costo===undefined ||
                          evento.id_modalidad===undefined || 
                          evento.id_tipo_evento===undefined 
                        )
                        {
                          throw createError(400,"Se requieren todos los parámetros del evento");
                        }
                            const result = await db.query(
                              `INSERT INTO eventos(id_evento,nombre,resumen,fecha, hora, imagen, url, dirigidoa, organizador, costo, id_modalidad_fk, id_tipo_evento_fk) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, 
                              [
                                evento.id_evento,
                                evento.nombre,
                                evento.resumen,
                                evento.fecha,
                                evento.hora,
                                evento.imagen,
                                evento.url,
                                evento.dirigidoa,
                                evento.organizador,
                                evento.costo,
                                evento.id_modalidad, 
                                evento.id_tipo_evento
                              ]
                            );          
                            let message = 'Error creando la evento';          
                            if (result.affectedRows) {
                              message = {  insertId: result.insertId, message:'evento creada exitosamente'};
                            }          
                            return {message};
                   }else{ 
                         throw createError(401,"Usted no tiene autorización"); 
                   }
            }catch{
                    throw error;
             }
  }/**End create*/

  /*------------------------------------------------update---------------------------------------------------*/
  async function update(idEvento, evento, token){
          try{
                if(token && validarToken(token)){
                        let payload=helper.parseJwt(token);
                        let tipo_user= payload.rol; 
                      if(tipo_user!='Administrador'){
                              throw createError(401,"Usted no tiene autorización para actualizar eventos");
                      }
                                  const result = await db.query(
                                    `UPDATE eventos 
                                    SET nombre=?,
                                        resumen=?,
                                        fecha=?,
                                        hora=?,
                                        imagen=?,
                                        url=?,
                                        dirigidoa=?,
                                        organizador=?,
                                        costo=?,
                                        id_modalidad_fk=?,
                                        id_tipo_evento_fk
                                    WHERE id_evento=?`,
                                    [
                                      evento.nombre,
                                      evento.resumen,
                                      evento.fecha,
                                      evento.hora,
                                      evento.imagen,
                                      evento.url,
                                      evento.dirigidoa,
                                      evento.organizador,
                                      evento.costo,
                                      evento.id_modalidad_fk,
                                      evento.id_tipo_evento_fk,
                                      idEvento
                                    ] 
                                  );                      
                                  let message = 'Error actualizando el evento';                      
                                  if (result.affectedRows) {
                                    message = 'evento actualizado exitosamente';
                                  }                      
                                  return {message};
                    }else{ 
                       throw createError(401,"Usted no tiene autorización"); 
                    }
              }catch{
                   throw error;
              }
  }/*End Update*/
  
/*------------------------------------------------remove---------------------------------------------------*/  
  async function remove(idEvento, token){
            try{
                  if(token && validarToken(token)){
                          let payload=helper.parseJwt(token);
                          let tipo_user= payload.rol; 
                        if(tipo_user!='Administrador'){
                                throw createError(401,"Usted no tiene autorización para actualizar eventos");
                        }
                        const result = await db.query(
                          `DELETE FROM eventos WHERE id_evento=?`, 
                          [idEvento]
                        );  
                        let message = 'Error borrando la evento';  
                        if (result.affectedRows) {
                          message = 'evento borrada exitosamente';
                        }  
                        return {message};
                  }else{ 
                        throw createError(401,"Usted no tiene autorización"); 
                  }
           }catch{
                throw error;
           }
  }/*End remove*/

  /*------------------------------updateParcialEvento-------------------------------------------------*/
async function updateParcialEvento(idEvento, evento, token){  
        if(token && validarToken(token))
        {
          const payload=helper.parseJwt(token); 
          const rol = payload.rol;
          if(rol != "Administrador"){
            throw createError('401', "Usted no esta autorizado para realizar éste proceso.")
          }      
          const rows2 = await db.query(
            `select ev.*
            from eventos as ev
            where ev.id_evento = ?=`, 
            [
              idEvento
            ]
          );
          if(rows2.length < 1 ){
            throw createError('401', 'El evento no existe.')
          }
          var atributos = Object.keys(evento);   
          if(atributos.length!=0)
          {    
            var params = Object.values(evento);   
            var query = "update eventos set ";
            params.push(idEvento);
            for(var i=0; i < atributos.length; i++) {
              query = query + atributos[i] + '=?,';
            }
            query = query.substring(0, query.length-1);/*eliminar la coma final*/ 
            query = query +' '+'where id_evento=?'
            const result = await db.query(query,params);          
            let message = '';
            if (result.affectedRows) {
               message = 'Evento actualizado exitosamente';
            }else{
              throw createError(500,"No se pudo actualizar el evento");    
            }
            return {message};
          }
          throw createError(400,"No hay parámetros para actualizar");
      }else{
        throw createError(401,"Usuario no autorizado");
      }
}/*End updateParcialEvento*/

module.exports = {
  getMultiple,
  create,
  update,
  remove,
  updateParcialEvento
}