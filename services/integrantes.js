const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

/*_____________________ getintegrantes______________________________________________*/
async function getintegrantes(page = 1){
        const offset = helper.getOffset(page, config.listPerPage);
        const rows = await db.query(
          `SELECT i.* 
           FROM integrantes as i
           LIMIT ?,?`, 
          [offset, config.listPerPage]
        );
        const data = helper.emptyOrRows(rows);
        const meta = {page};
        return {
          data,
          meta
        } 
}/*End getintegrantes*/

/*_____________________ registrarintegrantes______________________________________________*/
async function registrarintegrantes(integrantes,token){
        try{
                if(token && validarToken(token)){
                     let payload=helper.parseJwt(token);
                     let tipo_user= payload.rol; 
                      if(tipo_user!='Administrador'){
                              throw createError(401,"Usted no tiene autorización para actualizar la información de los integrantes");
                      }
                      if(integrantes.nombres === undefined || 
                        integrantes.apellidos === undefined ||
                        integrantes.descripcion === undefined ||
                        id_enlaces_interes === undefined || 
                        integrantes.imagen === undefined 
                        ){
                              throw createError(400,"Debe enviar todos los datos requeridos para el registro de la información de integrantes");
                        }
                      try{
                            const result = await db.query(
                              `INSERT INTO integrantes(nombres,apellidos,descripcion,id_enlaces_interes_entidad,imagen) VALUES (?,?,?,?,?)`, 
                              [
                                integrantes.nombres,
                                integrantes.apellidos, 
                                integrantes.descripcion,
                                integrantes.id_enlaces_interes,
                                integrantes.imagen
                              ]
                            );  
                            let message = 'Error registrando la información de integrantes';  
                            if (result.affectedRows) {
                              message = 'integrantes registrada exitosamente';
                              return {message};
                            }else {
                                  throw createError(500,"Ocurrió un problema al registrar la información de integrantes");
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
  }/*End registrarintegrantes*/

  /*_____________________ actualizarintegrantes______________________________________________*/
  async function actualizarintegrantes(id, integrantes,token){  
            try{
              if(token && validarToken(token)){
                  let payload=helper.parseJwt(token);
                  let tipo_user= payload.rol; 
                    if(tipo_user!='Administrador'){
                            throw createError(401,"Usted no tiene autorización para actualizar la información de los integrantes");
                    }
                  if(
                    integrantes.nombres === undefined || 
                    integrantes.apellidos === undefined ||
                    integrantes.descripcion === undefined ||
                    integrantes.id_enlaces_interes === undefined || 
                    integrantes.imagen === undefined 
                    )
                    {
                        throw createError(400,"Debe enviar todos los datos requeridos para la actualización de la información de integrantes");
                    }
                    const result = await db.query(
                    `UPDATE integrantes
                    SET nombres=?, 
                        apellidos=?,
                        descripcion=?,
                        id_enlaces_interes=?,
                        imagen=?
                    WHERE id=?`,
                    [
                      integrantes.nombres,
                      integrantes.apellidos, 
                      integrantes.descripcion,
                      integrantes.id_enlaces_interes,
                      integrantes.imagen,
                      id
                    ] 
                  );  
                  let message = 'Error actualizando la información de integrantes';  
                  if (result.affectedRows) {
                    message = 'integrantes actualizada exitosamente';
                  }  
                  return {message};
                }else{ 
                  throw createError(401,"Usted no tiene autorización"); 
              }
        }catch(error){
              throw error;
        }
  }/*End actualizarintegrantes*/
  
  /*______________________ eliminarintegrantes_______________________________*/
  async function eliminarintegrantes(id,token){
          try{
              if(token && validarToken(token)){
                  let payload=helper.parseJwt(token);
                  let tipo_user= payload.rol; 
                    if(tipo_user!='Administrador'){
                            throw createError(401,"Usted no tiene autorización para eliminar la información de los integrantes");
                    }
                    const result = await db.query(
                      `DELETE FROM integrantes WHERE id=?`, 
                      [id]
                    );  
                    let message = 'Error borrando la información de integrantes';  
                    if (result.affectedRows) {
                      message = 'integrante borrado exitosamente';
                    }  
                    return {message};
                }else{ 
                    throw createError(401,"Usted no tiene autorización"); 
                }
          }catch(error){
                throw error;
          }
  }/*End eliminarintegrantes*/

module.exports = {
  getintegrantes,
  registrarintegrantes,
  actualizarintegrantes,
  eliminarintegrantes
}