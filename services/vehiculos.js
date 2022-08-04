const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const {validarToken} = require ('../middelware/auth');
var createError = require('http-errors');

async function getMultiple(page = 1){
        const offset = helper.getOffset(page, config.listPerPage);
        const rows = await db.query(
          `SELECT v.* , f.fotov
           FROM vehiculos as v left join fotosVehiculos as f on (f.id_vehiculo_fk = v.id_vehiculo)
           LIMIT ?,?`, 
          [offset, config.listPerPage]
        );
        if(rows.length<1){
          throw createError(404,"No hay vehiculos registrados");
        }
          var arrayfotos= new Array();
          var nuevoRows = new Array();
          var index= rows[0].id_vehiculo;
          nuevoRows.push(rows[0]);        
          rows.forEach((element)=>{           
            if((index == element.id_vehiculo))
            { 
              if(element.fotov){
                    arrayfotos.push(element.fotov);
              }          
            }else { 
                      index= element.id_vehiculo;
                      nuevoRows[nuevoRows.length-1].fotos=arrayfotos;
                      nuevoRows.push(element);
                      arrayfotos=[];  
                      if(element.fotov){
                          arrayfotos.push(element.fotov);
                      } 
            }
          });        
          nuevoRows[nuevoRows.length-1].fotos=arrayfotos;          
          const data = helper.emptyOrRows(nuevoRows); 
          const meta = {page};
        return {
          data,
          meta
        }
}/*End getMultiple*/

async function getVehiculoUser(page = 1, id_user){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT v.* , f.fotov
     FROM vehiculos as v left join fotosVehiculos as f on (f.id_vehiculo_fk = v.id_vehiculo)
     WHERE  v.usuarios_id=?
     LIMIT ?,?`, 
    [id_user, offset, config.listPerPage]
  );
  if(rows.length<1){
    throw createError(404,"Usuario sin vehiculos");
  }
    var arrayfotos= new Array();
    var nuevoRows = new Array();
    var index= rows[0].id_vehiculo;
    nuevoRows.push(rows[0]);        
    rows.forEach((element)=>{           
      if((index == element.id_vehiculo))
      { 
        if(element.fotov){
              arrayfotos.push(element.fotov);
        }          
      }else { 
                index= element.id_vehiculo;
                nuevoRows[nuevoRows.length-1].fotos=arrayfotos;
                nuevoRows.push(element);
                arrayfotos=[];  
                if(element.fotov){
                    arrayfotos.push(element.fotov);
                } 
      }
    });        
    nuevoRows[nuevoRows.length-1].fotos=arrayfotos;          
    const data = helper.emptyOrRows(nuevoRows); 
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
                    if(vehiculo.capacidad==undefined || vehiculo.modelo==undefined || vehiculo.transporte_alimento==undefined )
                    {
                      throw createError(400,"Se requieren todos los parámetros!");
                    }                   
                    const result = await db.query(
                      `INSERT INTO vehiculos (capacidad,modelo,transporte_alimento,usuarios_id) VALUES (?,?,?,?)`, 
                      [
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
            if(vehiculo.capacidad==undefined || vehiculo.modelo==undefined || vehiculo.transporte_alimento==undefined )
            {
              throw createError(400,"Se requieren todos los parámetros!");
            }
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

  /*_____________updatePhotosVehiculos ________________________________*/
  async function updatePhotosVehiculos(idVehiculo,body,token){ 
    const verifyVehiculo = await db.query(
      `SELECT * FROM vehiculos WHERE id_vehiculo=?`, 
      [idVehiculo]
    );
     if (verifyVehiculo.length<1){
           throw createError(400,"Vehículo no se encuentra registrado");
     }
    var arrayfotos= body.arrayFotos;    
    let tipo_user=null;     
    const conection= await db.newConnection();
    await conection.beginTransaction();
    if(token && validarToken(token)){
        let payload=helper.parseJwt(token);
        tipo_user= payload.rol;
        let userN= payload.sub;         
        try{
            if(tipo_user!="Transportador"){ 
              throw createError(401,"Usted no tiene autorización");
            }else{
                if(arrayfotos){ 
                  try{  
                        const vehiculoDeUsuario= await db.query(
                        `SELECT *
                        FROM vehiculos as v
                        WHERE v.usuarios_id=? and v.id_vehiculo=? `,
                          [userN,idVehiculo]
                        );
                       
                        if(vehiculoDeUsuario.length<0){
                           throw createError(401,"Usuario no autorizado");
                        }

                        await db.query(
                        `DELETE from fotosVehiculos where id_vehiculo_fk=?`,
                          [idVehiculo]
                        );       
                        for(var i=0;i<arrayfotos.length;i++){
                            await db.query(
                              `INSERT INTO fotosVehiculos(fotov,id_vehiculo_fk) VALUES (?,?)`,
                              [arrayfotos[i], idVehiculo]
                            );
                        }                         
                  }catch(err) {
                        throw createError(400,err.message);
                  }
                }else{
                  throw createError(400,"Usted no agrego las fotos para actualizarlas"); 
                }
          } 
          await conection.commit(); 
          conection.release();
          message = "Fotos actualizadas correctamente";
          return { message };
        }catch (error) {
          await conection.rollback(); 
          conection.release();
          throw error;
      } 
    }else{
      throw createError(401,"Usuario no autorizado");
    }
  } //* updatePhotosVehiculos */

    /*_____________getDetailVehiculo ________________________________*/
    async function getDetailVehiculo(idVehiculo){ 
      try{
           const rows = await db.query(
              `SELECT v.*
              FROM vehiculos as v
              WHERE v.id_vehiculo=?
              `, 
              [idVehiculo]
            );           
              if(rows.length < 1){
                throw createError(404, "No se encuentra el vehículo con el id "+idVehiculo+".")
              }
            const rowsfotos = await db.query(
              `SELECT fv.id_fotov, fv.fotov
              FROM  fotosVehiculos as fv
              WHERE fv.id_vehiculo_fk =?
              `, 
            [idVehiculo]
            );  
            var arrayfotos= new Array();  
            rowsfotos.forEach((element)=>{ 
                arrayfotos.push(element.fotov);
            });      
            var nuevoRows = new Array();
            nuevoRows.push(rows[0]);
            nuevoRows[nuevoRows.length-1].fotos_vehiculos=arrayfotos; 
  
            const data = helper.emptyOrRows(nuevoRows);                      
            return {
              data
            }
      } catch(err){        
            console.log(err);
            throw err;
      }
  }/*getDetailVehiculo*/

module.exports = {
  getMultiple,
  getVehiculoUser,
  create,
  update,
  remove,
  updatePhotosVehiculos,
  getDetailVehiculo
}