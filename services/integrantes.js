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
                              throw createError(401,"Usted no tiene autorización para registrar la información de los integrantes");
                      }
                      const conection= await db.newConnection(); /*conection of TRANSACTION */
                      await conection.beginTransaction();
                      if(integrantes.nombres === undefined || 
                        integrantes.apellidos === undefined ||
                        integrantes.descripcion === undefined ||
                        integrantes.imagen === undefined ||
                        integrantes.fecha_nacimiento === undefined ||
                        integrantes.cargo === undefined 
                        ){
                              throw createError(400,"Debe enviar todos los datos requeridos para el registro de la información de integrantes");
                        }
                      try{
                            const result = await db.query(
                              `INSERT INTO integrantes(nombres,apellidos,descripcion,imagen, fecha_nacimiento,cargo) VALUES (?,?,?,?,?,?)`, 
                              [
                                integrantes.nombres,
                                integrantes.apellidos, 
                                integrantes.descripcion,
                                integrantes.imagen,
                                integrantes.fecha_nacimiento,
                                integrantes.cargo
                              ]
                            );  
                            let message = 'Error registrando la información del integrante';  
                            if (result.affectedRows) {
                              message = 'integrante registrado exitosamente';
                            }
                            const rowsId = await db.query(
                              `SELECT MAX(id) as id FROM integrantes`
                            ); /*ultimo Id_integrante que se creo con autoincremental*/
                        
                            var enlaces=JSON.parse(integrantes.arrayEnlaces);/*Pasar el string a vector*/        
                            for(var i=0;i<enlaces.length;i++){
                                await db.query(
                                  `INSERT INTO enlaces_integrantes(id_integrante,id_enlace) VALUES (?,?)`,
                                  [rowsId[0].id, enlaces[i]]
                                );
                            }
                            await conection.commit(); 
                                  conection.release();
                            return {message};
                      }catch(err){
                            await conection.rollback(); /*Si hay algún error  */ 
                                  conection.release();
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
                    const conection= await db.newConnection(); 
                          conection.beginTransaction();
                  if(
                    integrantes.nombres === undefined || 
                    integrantes.apellidos === undefined ||
                    integrantes.descripcion === undefined ||                   
                    integrantes.imagen === undefined ||
                    integrantes.fecha_nacimiento === undefined ||
                    integrantes.cargo === undefined 
                    )
                    {
                        throw createError(400,"Debe enviar todos los datos requeridos para la actualización de la información del integrante");
                    }
                    try{
                            const result = await db.query(
                            `UPDATE integrantes
                            SET nombres=?, 
                                apellidos=?,
                                descripcion=?,
                                imagen=?,
                                fecha_nacimiento=?,
                                cargo=?
                            WHERE id=?`,
                            [
                              integrantes.nombres,
                              integrantes.apellidos, 
                              integrantes.descripcion,
                              integrantes.imagen,
                              integrantes.fecha_nacimiento,
                              integrantes.cargo,
                              id
                            ] 
                          );  
                          let message = 'Error actualizando la información del integrante';  
                          if (result.affectedRows) {
                            message = 'integrante actualizado exitosamente';
                          }
                          var enlaces=JSON.parse(integrantes.arrayEnlaces);/*Pasar el string a vector*/      
                          await db.query(
                            `DELETE from categorias_novedades where id_novedad_pk_fk=?`,
                            [id]
                          );        
                          for(var i=0;i<enlaces.length;i++){
                              await db.query(
                                `INSERT INTO enlaces_integrantes(id_integrante,id_enlace) VALUES (?,?)`,
                                [id, enlaces[i]]
                              );
                          } 
                            conection.commit(); 
                            conection.release(); 
                            return {message};
                      }catch(error){
                                conection.rollback(); 
                                conection.release(); 
                                throw error
                      }
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
                    const conection= await db.newConnection(); /*conection of TRANSACTION */
                          conection.beginTransaction();
                    try {
                              await db.query(
                              `DELETE from enlaces_integrantes where id_integrante=?`,
                               [id]
                              );  /*Elimino la relación del integrante en la tabla enlaces_integrantes(id_integrante,id_enlace) */

                          const result = await db.query(
                            `DELETE FROM integrantes WHERE id=?`, 
                            [id]
                          );  
                          let message = 'Error borrando la información del integrante';  
                          if (result.affectedRows) {
                            message = 'integrante borrado exitosamente';
                          }  
                            conection.commit(); 
                            conection.release();
                            return {message};
                        }catch(error){
                                conection.rollback(); /*Si hay algún error  */ 
                                conection.release();
                                throw createError(500,"Error al eliminar el integrante");
                        }
                }else{ 
                    throw createError(401,"Usted no tiene autorización"); 
                }
          }catch(error){
                throw error;
          }
  }/*End eliminarintegrantes*/

/*______________________________________updateparcialIntegrante___________________________________________*/
  async function updateParcialIntegrante(idUser, integrante, token){  
    try{
          if(token && validarToken(token)){
                  let payload=helper.parseJwt(token);
                  let tipo_user= payload.rol; 
                  if(tipo_user!='Administrador'){
                    throw createError(401,"Usted no tiene autorización para actualizar integrantes");
                  }                     
                      var atributos=Object.keys(integrante); /*Arreglo de los keys del integrante*/ 
                      if (atributos.length!=0){    
                          var param=Object.values(integrante);
                          var query = "UPDATE integrantes SET ";
                          param.push(idUser);/*Agrego el id al final de los parametros*/ 
                          for(var i=0; i<atributos.length;i++) {
                            query= query+atributos[i]+'=?,';      }
                          query= query.substring(0, query.length-1);/*eliminar la coma final*/ 
                          query= query+' '+'WHERE id=?'
                          const result = await db.query(query,param);    
                          let message = 'Error actualizando el registro del integrante';    
                          if (result.affectedRows) {
                            message = 'Integrante actualizado exitosamente';
                          }
                          return {message};
                    }
                      throw createError(400,"No hay parametros para actualizar");
          }else{
            throw createError(401,"Usuario no autorizado"); 
          }
        } catch (error) {
              console.log(error);
              throw error;
        }   
}/*End updateParcialIntegrante*/

module.exports = {
  getintegrantes,
  registrarintegrantes,
  actualizarintegrantes,
  eliminarintegrantes,
  updateParcialIntegrante
}