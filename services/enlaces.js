const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

/*_____________________ getLink______________________________________________*/
async function obtenerLink(page = 1){
        const offset = helper.getOffset(page, config.listPerPage);
        const rows = await db.query(
          `SELECT link.* 
           FROM enlaces_interes as link
           LIMIT ?,?`, 
          [offset, config.listPerPage]
        );
        const data = helper.emptyOrRows(rows);
        const meta = {page};
        return {
          data,
          meta
        } 
}/*End getLink*/

/*_____________________ registrarLink______________________________________________*/
async function registrarLink(Link,token){ 
        try{
                if(token && validarToken(token)){  
                     let payload=helper.parseJwt(token);
                     let tipo_user= payload.rol; 
                      if(tipo_user!='Administrador'){
                              throw createError(401,"Usted no tiene autorización para actualizar los enlaces de interés");
                      }
                      if(Link.nombre === undefined){
                              throw createError(400,"Debe enviar el nombre del enlace para su registro");
                        }
                      try{
                            const result = await db.query(
                              `INSERT INTO enlaces_interes(nombre) VALUES (?)`, 
                              [
                                Link.nombre
                              ]
                            );  
                            let message = 'Error registrando el enlace de interés ';  
                            if (result.affectedRows) {
                              message = 'Registro del enlace de interés exitoso';
                              return {message};
                            }else {
                                  throw createError(500,"Ocurrió un problema al registrar el enlace de interés");
                            }
                      }catch(err){
                          throw err;
                      } 
                }else{ 
                    throw createError(401,"Usted no tiene autorización"); 
                }
          }catch(error){
                throw error;
          }
  }/*End registrarLink*/

  /*_____________________ actualizarLink______________________________________________*/
  async function actualizarLink(id, Link,token){  
            try{
              if(token && validarToken(token)){
                  let payload=helper.parseJwt(token);
                  let tipo_user= payload.rol; 
                    if(tipo_user!='Administrador'){
                            throw createError(401,"Usted no tiene autorización para actualizar el enlace de interés");
                    }
                  if(Link.nombre === undefined)
                    {
                        throw createError(400,"Debe enviar el nombre del enlace de interés para su actualización");
                    }
                    const result = await db.query(
                    `UPDATE enlaces_interes
                    SET nombre=?
                    WHERE id=?`,
                    [ 
                      Link.nombre,
                      id
                    ] 
                  );  
                  let message = 'Error actualizando el enlace de interés';  
                  if (result.affectedRows) {
                    message = 'Actualización de Link exitoso';
                  }  
                  return {message};
                }else{ 
                  throw createError(401,"Usted no tiene autorización"); 
              }
        }catch(error){
              throw error;
        }
  }/*End actualizarLink*/
  
  /*______________________ eliminarLink_______________________________*/
  async function eliminarLink(id,token){
          try{
              if(token && validarToken(token)){
                  let payload=helper.parseJwt(token);
                  let tipo_user= payload.rol; 
                    if(tipo_user!='Administrador'){
                            throw createError(401,"Usted no tiene autorización para actualizar los enlaces de interés");
                    }
                    const result = await db.query(
                      `DELETE FROM enlaces_interes WHERE id=?`, 
                      [id]
                    );  
                    let message = 'Error borrando el enlace de interés';  
                    if (result.affectedRows) {
                      message = 'Enlace de interés borrado exitosamente';
                    }  
                    return {message};
                }else{ 
                    throw createError(401,"Usted no tiene autorización"); 
                }
          }catch(error){
                throw error;
          }
  }/*End eliminarLink*/


module.exports = {
  obtenerLink,
  registrarLink,
  actualizarLink,
  eliminarLink
}