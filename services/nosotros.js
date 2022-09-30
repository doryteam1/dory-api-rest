const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

/*_____________________ getNosotros______________________________________________*/
async function getNosotros(page = 1){
        const offset = helper.getOffset(page, config.listPerPage);
        const rows = await db.query(
          `SELECT nos.* 
           FROM nosotros as nos
           LIMIT ?,?`, 
          [offset, config.listPerPage]
        );
        const data = helper.emptyOrRows(rows);
        const meta = {page};
        return {
          data,
          meta
        } 
}/*End getNosotros*/

/*_____________________ registrarNosotros______________________________________________*/
async function registrarNosotros(nosotros,token){
        try{
                if(token && validarToken(token)){
                     let payload=helper.parseJwt(token);
                     let tipo_user= payload.rol; 
                      if(tipo_user!='Administrador'){
                              throw createError(401,"Usted no tiene autorización para actualizar la información de nosotros");
                      }
                      if(nosotros.identidad === undefined || 
                        nosotros.mision === undefined ||
                        nosotros.vision === undefined ||
                        nosotros.imagen_identidad === undefined || 
                        nosotros.imagen_mision === undefined ||
                        nosotros.imagen_vision === undefined
                        ){
                              throw createError(400,"Debe enviar todos los datos requeridos para el registro de la información de nosotros");
                        }
                      try{
                            const result = await db.query(
                              `INSERT INTO nosotros(identidad,mision,vision,imagen_identidad,imagen_mision,imagen_vision) VALUES (?,?,?,?,?,?)`, 
                              [
                                nosotros.identidad,
                                nosotros.mision, 
                                nosotros.vision,
                                nosotros.imagen_identidad,
                                nosotros.imagen_mision,
                                nosotros.imagen_vision
                              ]
                            );  
                            let message = 'Error registrando la información de nosotros';  
                            if (result.affectedRows) {
                              message = 'Nosotros registrada exitosamente';
                            }else {
                                  throw createError(500,"Ocurrió un problema al registrar la información de nosotros");
                            }
                      }catch(err){
                          throw err;
                      }      
                        return {message};
                }else{ 
                    throw createError(401,"Usted no tiene autorización"); 
                }
          }catch(error){
                throw error;
          }
  }/*End registrarNosotros*/

  /*_____________________ actualizarNosotros______________________________________________*/
  async function actualizarNosotros(id, nosotros,token){  
            try{
              if(token && validarToken(token)){
                  let payload=helper.parseJwt(token);
                  let tipo_user= payload.rol; 
                    if(tipo_user!='Administrador'){
                            throw createError(401,"Usted no tiene autorización para actualizar la información de nosotros");
                    }
                  if(nosotros.identidad === undefined || 
                    nosotros.mision === undefined ||
                    nosotros.vision === undefined ||
                    nosotros.imagen_identidad === undefined || 
                    nosotros.imagen_mision === undefined ||
                    nosotros.imagen_vision === undefined)
                    {
                        throw createError(400,"Debe enviar todos los datos requeridos para la actualización de la información de nosotros");
                    }
                    const result = await db.query(
                    `UPDATE nosotros
                    SET identidad=?, 
                        mision=?,
                        vision=?,
                        imagen_identidad=?,
                        imagen_mision,
                        imagen_vision
                    WHERE id=?`,
                    [
                      nosotros.identidad,
                      nosotros.mision, 
                      nosotros.vision,
                      nosotros.imagen_identidad,
                      nosotros.imagen_mision,
                      nosotros.imagen_vision,
                      id
                    ] 
                  );  
                  let message = 'Error actualizando la información de nosotros';  
                  if (result.affectedRows) {
                    message = 'Nosotros actualizada exitosamente';
                  }  
                  return {message};
                }else{ 
                  throw createError(401,"Usted no tiene autorización"); 
              }
        }catch(error){
              throw error;
        }
  }/*End actualizarNosotros*/
  
  /*______________________ eliminarNosotros_______________________________*/
  async function eliminarNosotros(id,token){
          try{
              if(token && validarToken(token)){
                  let payload=helper.parseJwt(token);
                  let tipo_user= payload.rol; 
                    if(tipo_user!='Administrador'){
                            throw createError(401,"Usted no tiene autorización para actualizar la información de nosotros");
                    }
                    const result = await db.query(
                      `DELETE FROM nosotros WHERE id=?`, 
                      [id]
                    );  
                    let message = 'Error borrando la información de nosotros';  
                    if (result.affectedRows) {
                      message = 'Nosotros borrada exitosamente';
                    }  
                    return {message};
                }else{ 
                    throw createError(401,"Usted no tiene autorización"); 
                }
          }catch(error){
                throw error;
          }
  }/*End eliminarNosotros*/

module.exports = {
  getNosotros,
  registrarNosotros,
  actualizarNosotros,
  eliminarNosotros
}