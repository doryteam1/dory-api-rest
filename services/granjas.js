const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

async function getGranjaUsuario(page = 1,id_user){
      const offset = helper.getOffset(page, config.listPerPage);
      const rows = await db.query(
        `SELECT * 
        FROM granjas as g, usuarios as u, usuarios_granjas as ug
        WHERE u.id=? and ug.usuarios_id=? and ug.espropietario=1 and g.id_granja=ug.id_granja_pk_fk and g.anulado="creada"
        LIMIT ?,?`, 
        [id_user, id_user, offset, config.listPerPage]
      );
      const data = helper.emptyOrRows(rows);
      const meta = {page};
      return {
        data,
        meta
      }
}/*End getGranjaUsuario*/

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM granjas LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};
  return {
    data,
    meta
  }
}/*End GetMultiple*/

async function create(body,token){

      const conection= await db.newConnection(); /*conection of TRANSACTION */
      await conection.beginTransaction();
    if(token && validarToken(token)){
          try {                   
                const payload=helper.parseJwt(token);  
                const id_user=payload.sub;
                
                if(body.nombre_granja==undefined || 
                   body.area==undefined || 
                   body.numero_trabajadores==undefined ||
                   body.produccion_estimada_mes==undefined || 
                   body.direccion==undefined ||
                   body.descripcion==undefined || 
                   body.id_departamento==undefined || 
                   body.id_municipio==undefined)
                {
                  throw createError(400,"Se requieren todos los parámetros!");
                }                 
                 const result = await db.query(
                    `INSERT INTO granjas (id_granja,nombre,area,numero_trabajadores, produccion_estimada_mes,direccion,latitud,longitud,descripcion,id_departamento,id_municipio,id_corregimiento,id_vereda,anulado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
                    [
                      body.id_granja,
                      body.nombre_granja,
                      body.area,
                      body.numero_trabajadores,
                      body.produccion_estimada_mes,
                      body.direccion,
                      body.latitud,
                      body.longitud,
                      body.descripcion,
                      body.id_departamento,
                      body.id_municipio,
                      body.id_corregimiento,
                      body.id_vereda,
                      "creada"
                    ]
                );                
                  let message = {message: 'Error creando la granja'};                
                  if (result.affectedRows) {
                    message = {message:'Granja creada exitosamente'};
                  }
                  const rowsId = await db.query(
                    `SELECT MAX(id_granja) AS id FROM granjas`
                  ); /*ultimo Id_granja que se creo con autoincremental*/
              
                var tiposInfraestructuras=JSON.parse(body.arrayTiposInfraestructuras);/*Pasar el string a vector*/
                 
                 for(var i=0;i<tiposInfraestructuras.length;i++){
                    await db.query(
                      `INSERT INTO infraestructuras_granjas(id_granja_pk_fk,id_infraestructura_pk_fk) VALUES (?,?)`,
                      [rowsId[0].id, tiposInfraestructuras[i]]
                    );
                 }

                 var especies=JSON.parse(body.arrayEspecies);/*Pasar el string a vector*/
                 
                 for(var j=0;j<especies.length;j++){
                    await db.query(
                      `INSERT INTO especies_granjas(id_especie_pk_fk,id_granja_pk_fk) VALUES (?,?)`,
                      [especies[j], rowsId[0].id]
                    );
                 }
                  let puntuacion=0; 
                  let esfavorita=0; 
                  let espropietario=1;
                  await db.query(
                  `INSERT INTO usuarios_granjas (id_granja_pk_fk,usuarios_id,puntuacion,esfavorita,espropietario) VALUES (?,?,?,?,?)`, 
                  [
                    rowsId[0].id,
                    id_user,
                    puntuacion,
                    esfavorita,
                    espropietario
                  ]
                ); 
                await conection.commit(); 
                conection.release();
                return message;
          }catch (error) {
                await conection.rollback(); /*Si hay algún error  */ 
                conection.release();
                throw error;
          } 
     }else{
          throw createError(401,"Usted no tiene autorización"); 
     }
  }/*End Create*/

  /*granja,id-granja a modificar, token de usuario,array de id de tipos de infraestructuras de la granja actualizarlos, array de id de especies cultivadas actualizarlas*/
  async function update(idGranja, body, token){

    const conection= await db.newConnection(); /*conection of TRANSACTION */
    await conection.beginTransaction();
    if(token && validarToken(token)){
      try {                   
            const payload=helper.parseJwt(token);  
            const id_user=payload.sub;
            if(body.nombre_granja==undefined || 
               body.area==undefined || 
               body.numero_trabajadores==undefined ||
               body.produccion_estimada_mes==undefined || 
               body.direccion==undefined ||
               body.descripcion==undefined || 
               body.id_departamento==undefined || 
               body.id_municipio==undefined)
            {
              throw createError(400,"Se requieren todos los parámetros!");
            } 
            const result = await db.query(
              `UPDATE granjas 
              SET nombre=?,
                  area=? ,
                  numero_trabajadores=?,
                  produccion_estimada_mes=?,
                  direccion=? ,
                  latitud=? ,
                  longitud=? ,
                  descripcion=? ,
                  id_departamento=? ,
                  id_municipio=? ,
                  id_corregimiento=? ,
                  id_vereda=? 
              WHERE id_granja=?`,
              [
                  body.nombre,
                  body.area,
                  body.numero_trabajadores,
                  body.produccion_estimada_mes,
                  body.direccion,
                  body.latitud,
                  body.longitud,
                  body.descripcion,
                  body.id_departamento,
                  body.id_municipio,
                  body.id_corregimiento,
                  body.id_vereda,
                  idGranja
              ] 
            );          
            let message = 'Error actualizando la granja';          
            if (result.affectedRows) {
              message = 'Granja actualizada exitosamente';
            }             
                 var tiposInfraestructuras=JSON.parse(body.arrayTiposInfraestructuras);/*Pasar el string a vector*/                 
                 for(var i=0;i<tiposInfraestructuras.length;i++){
                    await db.query(
                      `UPDATE infraestructuras_granjas
                       SET id_infraestructura_pk_fk=?
                       WHERE id_granja_pk_fk=?`,
                      [tiposInfraestructuras[i], idGranja]
                    );
                 }

                 var especies=JSON.parse(body.arrayEspecies);/*Pasar el string a vector*/                 
                 for(var j=0;j<especies.length;j++){
                    await db.query(
                      `UPDATE especies_granjas 
                       SET id_especie_pk_fk=?
                       WHERE id_granja_pk_fk=?`,
                      [especies[j], idGranja]
                    );
                 }

            await conection.commit(); 
            conection.release();
            return message;
      }catch (error) {
            await conection.rollback(); /*Si hay algún error  */ 
            conection.release();
            throw error;
      } 
    }else{
      throw createError(401,"Usted no tiene autorización"); 
    }
  }/*End Update*/
  
  async function anularGranja(id_granja,token){
    let id_user=null;
    let message = 'Error anulando la granja';
    if(token && validarToken(token)){
          let payload=helper.parseJwt(token);
          id_user= payload.sub;
             
             if(id_granja!=undefined && id_user!=undefined && id_granja!=null && id_user!=null){
                try {
                    const result = await db.query(
                    `UPDATE FROM granjas SET anulado = 'anulada' WHERE id_granja=?`, 
                    [id_granja]
                    );             
                    if (result.affectedRows) {
                      message = 'granja anulada exitosamente';
                      return {message};
                    }              
                    throw createError(400,message);                            
                } catch(err) {
                     throw createError(400,err.message);
                }
             }else{
                throw createError(400,"Parámetros ingresados erroneamente"); 
             }
    }
  }/*End Remove*/

module.exports = {
  getMultiple,
  create,
  update,
  anularGranja,
  getGranjaUsuario
}