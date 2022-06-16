const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');
const dayjs = require('dayjs');

async function getAsociacionesDepartamento(page = 1, idDepartamento){  
        const offset = helper.getOffset(page, config.listPerPage);
        const rows = await db.query(
        `SELECT distinctrow  m.id_municipio, m.nombre, m.poblacion,
            (SELECT count(*) 
            FROM municipios m1, asociaciones a1
            WHERE m1.id_municipio=a1.id_municipio and  m1.id_municipio=m.id_municipio ) as count_asociaciones
        FROM  asociaciones as a, municipios as m, corregimientos as c,veredas as v, departamentos as d
        WHERE ( m.id_departamento_fk=d.id_departamento) and 
              (m.id_municipio=a.id_municipio or c.id_municipio=a.id_municipio or v.id_municipio=a.id_municipio)  and
              d.id_departamento=?
              LIMIT ?,?`, 
            [idDepartamento, offset, config.listPerPage]
       );
        const data = helper.emptyOrRows(rows);
        const meta = {page};
        return {
          data,
          meta
        }
}/*End GetAsociacionesDepartamento*/

/*--------------------getMultiple-------------------------------------*/
async function getMultiple(page = 1, token){
      if(token && validarToken(token)){ 
        const payload=helper.parseJwt(token); 
        const id_user= payload.sub;  
                const offset = helper.getOffset(page, config.listPerPage);
                const rows = await db.query(
                  `SELECT * 
                  FROM asociaciones as a left join asociaciones_usuarios as au on (a.nit=au.nit_asociacion_pk_fk)
                  WHERE au.usuarios_id=?
                   LIMIT ?,?`, 
                  [id_user,offset, config.listPerPage]
                );
                const data = helper.emptyOrRows(rows);
                const meta = {page};
                return {
                  data,
                  meta
                }
        }else{
          throw createError(401,"Usted no tiene autorización"); 
        }
}/*End getMultiple*/

/*-------------------------create-----------------------*/
async function create(asociacion){
    const result = await db.query(
      `INSERT INTO asociaciones(nit, nombre,direccion,legalconstituida,fecha_renovacion_camarac,foto_camarac,id_tipo_asociacion_fk,id_departamento,id_municipio,id_corregimiento,id_vereda) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, 
      [
        asociacion.nit,
        asociacion.nombre,
        asociacion.direccion,
        asociacion.legalconstituida,
        asociacion.fecha_renovacion_camarac,
        asociacion.foto_camarac,
        asociacion.id_tipo_asociacion_fk,
        asociacion.id_departamento,
        asociacion.id_municipio,
        asociacion.id_corregimiento,
        asociacion.id_vereda
      ]
    );  
    let message = 'Error creando asociacion';
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'asociacion creada exitosamente'};
    }
    return {message};
  }/*End create*/

  /*_----------------------------------update--------------------------------*/
  async function update(nit, asociacion){
    const result = await db.query(
      `UPDATE asociaciones 
       SET nombre=?,
           direccion=?,
           legalconstituida=?,
           fecha_renovacion_camarac=?,
           foto_camarac=?,
           id_tipo_asociacion_fk=?,
           id_departamento=?, 
           id_municipio=?,
           id_corregimiento=?,
           id_vereda=?
       WHERE nit=?`,
       [
        asociacion.nombre,
        asociacion.direccion,
        asociacion.legalconstituida,
        asociacion.fecha_renovacion_camarac,
        asociacion.foto_camarac,
        asociacion.id_tipo_asociacion_fk,
        asociacion.id_departamento,
        asociacion.id_municipio,
        asociacion.id_corregimiento,
        asociacion.id_vereda,
        nit
       ] 
    );
    let message = 'Error actualizando asociación';
    if (result.affectedRows) {
      message = 'Asociacion actualizada exitosamente';
    }
    return {message};
  }/*End update*/
  
  /*----------------------------------------remove-------------------------------------------*/
  async function remove(nit){
    const result = await db.query(
      `DELETE FROM asociaciones WHERE nit=?`, 
      [nit]
    );
    let message = 'Error borrando asociacion';  
    if (result.affectedRows) {
      message = 'Asociación borrada exitosamente';
    }  
    return {message};
  }/*End remove*/

  /*------------------------------enviarSolicitudAdicion---------------------------------------------*/
  async function enviarSolicitudAdicion(nit, token,body){
         var id_sender= 0;
         if(!body.quienEnvia || (body.quienEnvia!='usuario' && body.quienEnvia!='asociacion')){
                       throw createError(400,"No ha enviado la información correcta"); 
         }else{
            if(body.quienEnvia!='usuario'){
                id_sender=2;
            }else{ 
              id_sender=1;
            }
         }    
          const fecha= dayjs().format('YYYY-MM-DD')+"T"+dayjs().hour()+":"+dayjs().minute()+":"+dayjs().second();
          let message="Error al enviar la solicitud de adición a la asociación ";  
            if(token && validarToken(token)){
                      const payload=helper.parseJwt(token); 
                      const id_user= payload.sub;
                      const tipo_user= payload.rol; 
               try{      
                      if(!(tipo_user==='Piscicultor' || tipo_user==='Pescador')){
                          throw createError(401,"Tipo de usuario no Válido");
                      }
                      const result = await db.query(
                        `INSERT INTO solicitudes (id_estado_fk,usuarios_id_fk,id_sender_solicitud,nit_asociacion_fk,fecha) VALUES (?,?,?,?,?)`, 
                        [
                          1,
                          id_user,
                          id_sender,
                          nit,
                          fecha
                        ]
                        );                      
                      if(result.affectedRows){
                        message="Solicitud de adición enviada exitosamente"
                      };
                      return {message};
                  } catch(error){
                     throw error; 
                  }            
            }else{
              throw createError(401,"Usted no tiene autorización"); 
            }
  }/*End enviarSolicitudAdicion*/

    /*------------------------------removeSolicitudAdicion---------------------------------------------*/
    async function removeSolicitudAdicion(id_solicitud, token){
        let message="Error al eliminar la solicitud de la asociación";  
        if(token && validarToken(token)){
                  const payload=helper.parseJwt(token); 
                  const id_user= payload.sub;                 
                  const tipo_user= payload.rol; 
             try{      
                    if(!(tipo_user==='Piscicultor' || tipo_user==='Pescador')){
                        throw createError(401,"Tipo de usuario no Válido");
                    }
                    const consulta = await db.query(
                      `select * FROM solicitudes WHERE id_solicitud=? and usuarios_id_fk=?`, 
                      [id_solicitud, id_user]
                    );
                    if(consulta.length <= 0){  
                      throw createError(401,"Usuario autorizado, usted no realizo la solicitud");                  
                    }
                      const result = await db.query(
                        `DELETE FROM solicitudes WHERE id_solicitud=?`, 
                        [id_solicitud]
                      );                     
                    if(result.affectedRows){
                      message="Eliminación de solicitud exitoso"
                    };
                    return {message};
                } catch(error){
                  throw error; 
                }            
        }else{
          throw createError(401,"Usted no tiene autorización"); 
        }
}/*End removeSolicitudAdicion*/

module.exports = {
  getAsociacionesDepartamento,
  getMultiple,
  create,
  update,
  remove,
  enviarSolicitudAdicion,
  removeSolicitudAdicion
}