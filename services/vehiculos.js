const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const {validarToken} = require ('../middelware/auth');
var createError = require('http-errors');

async function getMultiple(page = 1){
        const offset = helper.getOffset(page, config.listPerPage);
        const rows = await db.query(
          `SELECT * FROM vehiculos LIMIT ?,?`, 
          [offset, config.listPerPage]
        );
        const data = helper.emptyOrRows(rows);
        const meta = {page};
        return {
          data,
          meta
        }
}/*End getMultiple*/

async function getVehiculoUser(page = 1, id_user){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * 
     FROM vehiculos as v
     WHERE  v.usuarios_id=?
     LIMIT ?,?`, 
    [id_user, offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};
  return {
    data,
    meta
  }
}/*End getVehiculoUser*/

/*----------------------------------create-vehículo-------------------------------------------------- */

async function create(vehiculo,token){

               if(token && validarToken(token)){
                 try {                   
                    const payload=helper.parseJwt(token);  
                    const id_user=payload.sub;
                    const rol=payload.rol;
                    vehiculo.usuarios_id=id_user;
                    
                    if(rol!="Transportador"){
                      throw createError(401,"tipo de usuario no autorizado");
                    }
                    if(vehiculo.id_vehiculo==undefined || vehiculo.capacidad==undefined || vehiculo.modelo==undefined || vehiculo.transporte_alimento==undefined)
                    {
                      throw createError(400,"Se requieren todos los parámetros!");
                    }                   
                    const result = await db.query(
                      `INSERT INTO vehiculos (id_vehiculo,capacidad,modelo,transporte_alimento,usuarios_id) VALUES (?,?,?,?,?)`, 
                      [
                        vehiculo.id_vehiculo,
                        vehiculo.capacidad,
                        vehiculo.modelo,
                        vehiculo.transporte_alimento,
                        id_user
                      ]
                    );                  
                    let message = {message: 'Error creando vehiculo'};                  
                    if (result.affectedRows) {
                      message = {message:'Vehículo creado exitosamente'};
                      return message;
                    }else{
                      throw createError(500,"ocurrió un problema al registrar el vehículo");
                    }                    
                 }catch (error) {
                           throw error;
                 }    
              }else{
                throw createError(401,"Usted no tiene autorización"); 
            }

  }/*End Create*/

  /*----------------------------------update-vehículo-------------------------------------------------- */

  async function update(id_veh,vehiculo,token){

              if(token && validarToken(token)){
                  try {
                      const payload=helper.parseJwt(token);  
                      vehiculo.usuarios_id=payload.sub;
                      const rol=payload.rol;
                                        
                    if(rol!="Transportador"){
                      throw createError(401,"tipo de usuario no autorizado");
                    }
                      const result = await db.query(
                        `UPDATE vehiculos 
                        SET capacidad=?,
                            modelo=?,
                            transporte_alimento=?,
                            usuarios_id=?
                        WHERE id_vehiculo=?`,
                        [
                          vehiculo.capacidad,
                          vehiculo.modelo,
                          vehiculo.transporte_alimento,
                          vehiculo.usuarios_id,
                          id_veh
                        ] 
                      );  
                      let message = 'Error actualizando vehículo';  
                      if (result.affectedRows) {
                        message = 'vehículo actualizado exitosamente';
                        return {message};
                      } 
                      else{
                        throw createError(500,"ocurrió un problema al actualizar el vehículo");
                      }                       
                }catch (error) {
                        throw error;
                } 
              }else{
                throw createError(401,"Usted no tiene autorización"); 
              }
  }/*End Update*/

  /*----------------------------------remove-vehículo-------------------------------------------------- */
  
  async function remove(id_vehiculo,token){

            if(token && validarToken(token)){
                  try {
                      const payload=helper.parseJwt(token);  
                      const id_user=payload.sub;
                      const rol=payload.rol;
                                        
                      if(rol!="Transportador"){
                        throw createError(401,"tipo de usuario no autorizado");
                      }
                      const result = await db.query(
                        `DELETE FROM vehiculos WHERE id_vehiculo=? and usuarios_id=?`, 
                        [id_vehiculo,id_user]
                      );                    
                      let message = 'Error borrando vehiculo';                    
                      if (result.affectedRows) {
                        message = 'vehiculo borrada exitosamente';
                        return {message};
                      }else{
                        throw createError(500,"ocurrió un problema al eliminar el vehículo");
                      }   
                     
                  }catch (error) {
                      throw error;
                  }
           }else{
              throw createError(401,"Usted no tiene autorización"); 
           }
  }/*End remove*/

module.exports = {
  getMultiple,
  getVehiculoUser,
  create,
  update,
  remove
}