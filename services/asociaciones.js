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
async function getMultiple(page = 1, id_user){
      
                const offset = helper.getOffset(page, config.listPerPage);
                const rows = await db.query(
                  `SELECT a.nit,a.nombre,a.direccion,a.legalconstituida,a.fecha_renovacion_camarac,a.foto_camarac,
                          a.id_tipo_asociacion_fk,a.id_departamento,a.id_municipio,
                          (select d.nombre_departamento from departamentos d  where d.id_departamento=a.id_departamento) as departamento,
                          (select m.nombre from municipios as m  where m.id_municipio=a.id_municipio) as municipio,
                          a.id_corregimiento,a.id_vereda, a.informacion_adicional_direccion,a.corregimiento_vereda,au.usuarios_id,
                          (SELECT concat (u.nombres,' ',u.apellidos) from usuarios u where u.id=au.usuarios_id) as propietario,
                          (select ta.nombre from tipos_asociaciones as ta where ta.id_tipo_asociacion = a.id_tipo_asociacion_fk) as tipo_asociacion
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
}/*End getMultiple*/

/*-------------------------create-----------------------*/
async function create(asociacion,token){
        const conection= await db.newConnection(); 
        await conection.beginTransaction(); 
        let message = 'Error creando asociacion';
          if(token && validarToken(token)){ 
                    const payload=helper.parseJwt(token);                             
                    const tipo_user= payload.rol; 
                    const id_user= payload.sub; 
              try{      
                  if(!(tipo_user==='Piscicultor' || tipo_user==='Pescador')){
                      throw createError(401,"Tipo de usuario no Válido");
                  } 
                          if(asociacion.nit===undefined ||
                              asociacion.nombre===undefined ||                           
                              asociacion.direccion===undefined ||
                              asociacion.legalconstituida===undefined || 
                              asociacion.fecha_renovacion_camarac===undefined || 
                              asociacion.foto_camarac===undefined ||
                              asociacion.id_tipo_asociacion_fk === undefined ||
                              asociacion.id_departamento === undefined ||
                              asociacion.id_municipio === undefined ||
                              asociacion.informacion_adicional_direccion === undefined ||
                              asociacion.corregimiento_vereda === undefined
                              )
                          {
                            throw createError(400,"Se requieren todos los parámetros!");
                          }
                          const result = await conection.execute(
                            `INSERT INTO asociaciones(nit, nombre,direccion,legalconstituida,fecha_renovacion_camarac,foto_camarac,id_tipo_asociacion_fk,id_departamento,id_municipio,informacion_adicional_direccion,corregimiento_vereda ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, 
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
                              asociacion.informacion_adicional_direccion,
                              asociacion.corregimiento_vereda 
                            ]
                          );                          
                          await conection.execute(
                            `INSERT INTO asociaciones_usuarios (nit_asociacion_pk_fk,usuarios_id) VALUES (?,?)`, 
                            [
                              asociacion.nit,
                              id_user
                            ]
                            );    console.log(result);                        
                          if (result.affectedRows) {console.log('Entrada');
                             message = {  nit: asociacion.nit, message:'asociacion creada exitosamente'};
                          }
                            await conection.commit(); 
                            conection.release(); 
                            return {message};
                  } catch(error){
                          await conection.rollback(); 
                          conection.release();
                          throw error; 
                  }
            }else{
              throw createError(401,"Usted no tiene autorización"); 
            }
  }/*End create*/

  /*_----------------------------------update--------------------------------*/
  async function update(nit, asociacion,token){
          if(token && validarToken(token)){ 
            const payload=helper.parseJwt(token);                             
            const tipo_user= payload.rol; 
            const id_user=payload.sub;
              try{      
                if(!(tipo_user==='Piscicultor' || tipo_user==='Pescador')){
                    throw createError(401,"Tipo de usuario no Válido");
                }
                        if( asociacion.nombre===undefined ||                           
                            asociacion.direccion===undefined ||
                            asociacion.legalconstituida===undefined || 
                            asociacion.fecha_renovacion_camarac===undefined || 
                            asociacion.foto_camarac===undefined ||
                            asociacion.id_tipo_asociacion_fk === undefined ||
                            asociacion.id_departamento === undefined ||
                            asociacion.id_municipio === undefined ||
                            asociacion.informacion_adicional_direccion === undefined ||
                            asociacion.corregimiento_vereda === undefined
                            )
                        {
                          throw createError(400,"Se requieren todos los parámetros!");
                        }
                        const rows = await conection.execute(
                          `SELECT * 
                          FROM asociaciones as a left join asociaciones_usuarios as au on (a.nit=au.nit_asociacion_pk_fk and a.nit=?)
                          WHERE au.usuarios_id=?
                           LIMIT ?,?`, 
                          [nit,id_user,offset, config.listPerPage]
                        );
                    if(rows.length<1){
                         throw createError(401,"Usted no tiene autorización para actualizar la asociación"); 
                    }
                  const result = await conection.execute(
                    `UPDATE asociaciones 
                     SET nombre=?,
                        direccion=?,
                        legalconstituida=?,
                        fecha_renovacion_camarac=?,
                        foto_camarac=?,
                        id_tipo_asociacion_fk=?,
                        id_departamento=?, 
                        id_municipio=?,
                        informacion_adicional_direccion=?,
                        corregimiento_vereda=?
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
                      asociacion.informacion_adicional_direccion,
                      asociacion.corregimiento_vereda,
                      nit
                    ] 
                  );
                  let message = 'Error actualizando asociación';
                  if (result.affectedRows) {
                    message = 'Asociacion actualizada exitosamente';
                  }
                  return {message};
                } catch(error){
                       throw error; 
                }
          }else{
            throw createError(401,"Usted no tiene autorización"); 
          }
  }/*End update*/
  
  /*----------------------------------------remove-------------------------------------------*/
  async function remove(nit,token){
        const conection= await db.newConnection(); 
        await conection.beginTransaction(); 
    if(token && validarToken(token)){ 
        const payload=helper.parseJwt(token);                             
        const tipo_user= payload.rol;
        const id_user= payload.sub; 
        try{      
                  if(!(tipo_user==='Piscicultor' || tipo_user==='Pescador')){
                      throw createError(401,"Tipo de usuario no Válido");
                  }
                  if(nit!=undefined && id_user!=undefined && nit!=null && id_user!=null){ 
                            const rows = await db.query(
                              `SELECT * 
                              FROM asociaciones as a left join asociaciones_usuarios as au on (a.nit=au.nit_asociacion_pk_fk and a.nit=?)
                              WHERE au.usuarios_id=?
                              `, 
                              [nit,id_user]
                            );
                        if(rows.length<1){
                            throw createError(401,"Usted no tiene autorización para eliminar la asociación"); 
                        }
                        await db.query(
                          `DELETE FROM asociaciones_usuarios WHERE nit_asociacion_pk_fk=? and usuarios_id=? `, 
                          [nit,id_user]
                          );
                        const result = await db.query(
                        `DELETE FROM asociaciones WHERE nit=?`, 
                        [nit]
                        );
                        await conection.commit(); 
                        conection.release(); 
                        let message = 'Error borrando asociacion';  
                        if (result.affectedRows) {
                          message = 'Asociación borrada exitosamente';
                        }  
                          return {message};
                  }else{
                    throw createError(402,"Parámetros ingresados erroneamente");
                  }
           } catch(error){
                    await conection.rollback(); 
                    conection.release();
                    throw error; 
            }
     }else{
       throw createError(401,"Usted no tiene autorización"); 
     }
  }/*End remove*/

  /*------------------------------enviarSolicitudAdicion---------------------------------------------*/
  async function enviarSolicitudAdicion(nit, token,body){
          let id_user= 0;
          let tipo_user='';
        if(token && validarToken(token)){
              const payload=helper.parseJwt(token);                
               tipo_user= payload.rol; 
              if(!(tipo_user==='Piscicultor' || tipo_user==='Pescador')){
                throw createError(401,"Tipo de usuario no Válido");
              }
        }else{
          throw createError(401,"Usted no tiene autorización"); 
        }
         var id_sender= 1;
         if(!body.quienEnvia || (body.quienEnvia!='usuario' && body.quienEnvia!='asociacion')){
                       throw createError(400,"No ha enviado la información correcta"); 
         }else{
            if(body.quienEnvia=='usuario'){
                id_sender=1;
                id_user= payload.sub;
            }else if(body.quienEnvia=='asociacion'){                    
                   if(!body.id_usuario_receptor){
                         throw createError(400,"No se especificó el ID del usuario receptor de la solicitud");
                   }
                   id_sender=2;
                   id_user= body.id_usuario_receptor;
            }else{
                throw createError(400,"Debe especificar correctamente quien envia la solicitud");
            }
         }    
          const fecha= dayjs().format('YYYY-MM-DD')+"T"+dayjs().hour()+":"+dayjs().minute()+":"+dayjs().second();
          let message="Error al enviar la solicitud de adición a la asociación ";  
            
               try{   
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