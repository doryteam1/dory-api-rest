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

/*---------------------- GetAsociacionesMunicipio--------------------------------*/
async function getAsociacionesMunicipio(page = 1, idMunic){  
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
  `SELECT a.*, (select ta.nombre from tipos_asociaciones as ta  where ta.id_tipo_asociacion=a.id_tipo_asociacion_fk) as tipo_asociacion ,
          d.nombre_departamento as departamento, 
          m.nombre as municipio, 
          ta.nombre as tipo_asociacion,
          (select tu.nombre_tipo_usuario 
            from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id and au.nit_asociacion_pk_fk = a.nit
                                             inner join tipos_usuarios as tu on tu.id_tipo_usuario = u.id_tipo_usuario 
            ) as tipo_propietario,
          (select u.id 
          from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id and au.nit_asociacion_pk_fk = a.nit) as id_propietario, 
          (select concat(u.nombres,' ',u.apellidos) 
          from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id and au.nit_asociacion_pk_fk = a.nit) as propietario,
          (select u.email 
          from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id and au.nit_asociacion_pk_fk = a.nit) as email  
     FROM asociaciones as a inner join departamentos as d on a.id_departamento = d.id_departamento
                            inner join municipios as m on a.id_municipio = m.id_municipio
                            inner join tipos_asociaciones as ta on a.id_tipo_asociacion_fk = ta.id_tipo_asociacion where a.id_municipio = ?`
     , 
    [idMunic]
 );
  const data = helper.emptyOrRows(rows);
  const meta = {};
  return {
    data,
    meta
  }
}/*End GetAsociacionesMunicipio*/

/*-------------------------------------------getDetail---------------------------------------------------------------------*/
async function getDetail(nit,token){          
         let id_user;
         let row;
        if(token && validarToken(token)){ 
              const payload=helper.parseJwt(token);  
              id_user= payload.sub; 
              row = await db.query(
                `SELECT a.*, d.nombre_departamento as departamento, m.nombre as municipio, ta.nombre as tipo_asociacion,
                          (select concat(u.nombres,' ',u.apellidos) 
                                from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id 
                                where au.nit_asociacion_pk_fk = ?) as propietario,
                          (select tu.nombre_tipo_usuario 
                          from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id and au.nit_asociacion_pk_fk = a.nit
                                                            inner join tipos_usuarios as tu on tu.id_tipo_usuario = u.id_tipo_usuario) as tipo_propietario,
                          (select u.id 
                          from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id and au.nit_asociacion_pk_fk = a.nit) as id_propietario,
                          (select u.email 
                          from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id and au.nit_asociacion_pk_fk = a.nit) as email_propietario, 
                          (select es.descripcion from solicitudes as s inner join estados_solicitudes as es on s.id_estado_fk = es.id_estado where s.nit_asociacion_fk = ? and s.usuarios_id = ?) as estado_solicitud, 
                          (select ss.nombre from solicitudes as s inner join sender_solicitud as ss on s.id_sender_solicitud = ss.id_sender_solicitud where s.nit_asociacion_fk = ? and s.usuarios_id = ?) as solicitud_enviada_por,
                          (select s.id_solicitud from solicitudes as s where s.nit_asociacion_fk = ? and s.usuarios_id = ?) as id_solicitud ,
                          (select count(*)  
                          from solicitudes as s
                          where s.id_estado_fk=2 and s.nit_asociacion_fk=?
                          )  as count_miembros                
                FROM asociaciones as a inner join departamentos as d on a.id_departamento = d.id_departamento
                                       inner join municipios as m on a.id_municipio = m.id_municipio
                                       inner join tipos_asociaciones as ta on a.id_tipo_asociacion_fk = ta.id_tipo_asociacion
                where a.nit = ?`,               
               [nit, nit, id_user, nit, id_user, nit, id_user, nit, nit]
               );
        }else{
                row = await db.query(
                  `SELECT a.*, d.nombre_departamento as departamento, m.nombre as municipio, ta.nombre as tipo_asociacion,
                            (select concat(u.nombres,' ',u.apellidos) 
                                  from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id 
                                  where au.nit_asociacion_pk_fk = ?) as propietario,
                            (select tu.nombre_tipo_usuario 
                            from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id and au.nit_asociacion_pk_fk = a.nit
                                                              inner join tipos_usuarios as tu on tu.id_tipo_usuario = u.id_tipo_usuario) as tipo_propietario,
                            (select u.id 
                            from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id and au.nit_asociacion_pk_fk = a.nit) as id_propietario,
                            (select u.email 
                            from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id and au.nit_asociacion_pk_fk = a.nit) as email_propietario
                  FROM asociaciones as a inner join departamentos as d on a.id_departamento = d.id_departamento
                                         inner join municipios as m on a.id_municipio = m.id_municipio
                                         inner join tipos_asociaciones as ta on a.id_tipo_asociacion_fk = ta.id_tipo_asociacion                                         
                  where a.nit = ? `,               
                [nit,nit]
                );
        }  
            const data = helper.emptyOrRows(row);
            return {
              data
            }
      
}/*End getDetail*/

/*--------------------getMultiple---Asociaciones del Usuario----------------------------------*/
async function getMultiple(page = 1, id_user){                
                const offset = helper.getOffset(page, config.listPerPage);
                const rows = await db.query(/*--------------------Asociaciones del Usuario como propietario----------------------------------*/
                  `SELECT a.nit,a.nombre,a.direccion,a.legalconstituida,a.fecha_renovacion_camarac,a.foto_camarac,
                          a.id_tipo_asociacion_fk,a.id_departamento,a.id_municipio,
                          (select d.nombre_departamento from departamentos d  where d.id_departamento=a.id_departamento) as departamento,
                          (select m.nombre from municipios as m  where m.id_municipio=a.id_municipio) as municipio,
                          a.id_corregimiento,a.id_vereda, a.informacion_adicional_direccion,a.corregimiento_vereda,au.usuarios_id,
                          (SELECT concat (u.nombres,' ',u.apellidos) from usuarios u where u.id=au.usuarios_id) as propietario,
                          (select tu.nombre_tipo_usuario 
                            from asociaciones_usuarios as au inner join usuarios as u on au.usuarios_id = u.id and au.nit_asociacion_pk_fk = a.nit
                                                             inner join tipos_usuarios as tu on tu.id_tipo_usuario = u.id_tipo_usuario 
                          ) as tipo_propietario,
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

/*________________Asociaciones a las que pertenece como miembro el usuario________________*/
async function getAsociacionesMiembros(page = 1, id_user){
const rows2 = await db.query(
  `SELECT a.nit,a.nombre,a.direccion,a.legalconstituida,a.fecha_renovacion_camarac,a.foto_camarac,
          a.id_tipo_asociacion_fk,a.id_departamento,a.id_municipio,
          (select d.nombre_departamento from departamentos d  where d.id_departamento=a.id_departamento) as departamento,
          (select m.nombre from municipios as m  where m.id_municipio=a.id_municipio) as municipio,
          a.id_corregimiento,a.id_vereda, a.informacion_adicional_direccion,a.corregimiento_vereda,u.id,                          
          'Miembro' as propietario,
          (select ta.nombre from tipos_asociaciones as ta where ta.id_tipo_asociacion = a.id_tipo_asociacion_fk) as tipo_asociacion
   FROM asociaciones as a inner join solicitudes as s on s.nit_asociacion_fk=a.nit
                inner join estados_solicitudes as e on s.id_estado_fk=e.id_estado
                inner join sender_solicitud as ss on s.id_sender_solicitud=ss.id_sender_solicitud
                inner join usuarios as u on s.usuarios_id=u.id
   WHERE s.id_estado_fk=2  and s.usuarios_id=? 
  `, 
  [id_user]
); 
const data = helper.emptyOrRows(rows2);
const meta = {page};
return {
  data,
  meta
}
}/*getAsociacionesMiembros*/

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
                            );                          
                          if (result.affectedRows) {
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
        const conection= await db.newConnection(); 
        await conection.beginTransaction();        
        let message = '';
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
                          `, 
                          [nit,id_user]
                        );  
                    if(rows.length<1){
                         throw createError(401,"Usted no tiene autorización para actualizar la asociación"); 
                    }
                    await conection.execute(
                      `DELETE from asociaciones_usuarios where nit_asociacion_pk_fk=?  and usuarios_id=?`,
                        [nit,id_user]
                      );
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
                  await conection.execute(
                    `INSERT INTO asociaciones_usuarios(nit_asociacion_pk_fk,usuarios_id) VALUES (?,?)`,
                    [nit, id_user]
                  );  
                  if (result[0]['affectedRows']) {  
                      message = 'Asociacion actualizada exitosamente';
                  }else{
                      message='Error actualizando asociación';
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
                            const rows = await conection.execute(
                              `SELECT * 
                              FROM asociaciones as a left join asociaciones_usuarios as au on (a.nit=au.nit_asociacion_pk_fk and a.nit=?)
                              WHERE au.usuarios_id=?
                              `, 
                              [nit,id_user]
                            );
                        if(rows.length<1){
                            throw createError(401,"Usted no tiene autorización para eliminar la asociación"); 
                        }
                        await conection.execute(
                          `DELETE FROM solicitudes WHERE nit_asociacion_fk=?`, 
                          [nit]
                          );
                        await conection.execute(
                          `DELETE FROM asociaciones_usuarios WHERE nit_asociacion_pk_fk=? and usuarios_id=? `, 
                          [nit,id_user]
                          );
                        const result = await conection.execute(
                        `DELETE FROM asociaciones WHERE nit=?`, 
                        [nit]
                        );                        
                        let message = 'Error borrando asociacion';  
                        if (result[0]['affectedRows']) {
                          message = 'Asociación borrada exitosamente';
                        } 
                          await conection.commit(); 
                          conection.release(); 
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
          let id_usuario_creador= null;
          let id_user=null;
          let tipo_user='';
        if(token && validarToken(token)){
              const payload=helper.parseJwt(token);                
               tipo_user= payload.rol; 
               id_usuario_creador= payload.sub;
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
                id_sender = 1;
                id_user = id_usuario_creador;
            }else if(body.quienEnvia=='asociacion'){                    
                   if(!body.id_usuario_receptor){
                         throw createError(400,"No se especificó el ID del usuario receptor de la solicitud");
                   }
                   id_sender = 2;                   
                   id_user = body.id_usuario_receptor;
                  /*validación del representante legal de la asociación*/                  
                  const row = await db.query(
                    `SELECT au.*
                     FROM asociaciones_usuarios as au
                     WHERE au.usuarios_id=? and au.nit_asociacion_pk_fk=?`, 
                     [id_usuario_creador, nit]
                  );
                  if(row.length<1){
                    throw createError(401,"Usted no tiene autorización, No es el representante legal de la asociación"); 
                  }
            }else{
                throw createError(400,"Debe especificar correctamente quien envia la solicitud");
            }
         }    
        const fecha= dayjs().format('YYYY-MM-DD')+"T"+dayjs().hour()+":"+dayjs().minute()+":"+dayjs().second();
        let message="Error al enviar la solicitud de adición a la asociación ";              
        try{   
              const result = await db.query(
                `INSERT INTO solicitudes (id_estado_fk,usuarios_id_creador,usuarios_id,id_sender_solicitud,nit_asociacion_fk,fecha) VALUES (?,?,?,?,?,?)`, 
                [
                  1,
                  id_usuario_creador,
                  id_user,
                  id_sender,
                  nit,
                  fecha
                ]
                );                      
              if(result.affectedRows){
                message="Solicitud de adición enviada exitosamente"
              };
              return {message, insertId:result.insertId};
          } catch(error){
              throw error; 
          } 
  }/*End enviarSolicitudAdicion*/

    /*------------------------------removeSolicitudAdicion---------------------------------------------*/
    async function removeSolicitudAdicion(id_solicitud, token){
        let message="Error al eliminar la solicitud de la asociación";  
        if(token && validarToken(token)){
                  const payload = helper.parseJwt(token); 
                  const id_user = payload.sub;                 
                  const tipo_user= payload.rol; 
             try{      
                    if(!(tipo_user==='Piscicultor' || tipo_user==='Pescador')){
                        throw createError(401,"Tipo de usuario no Válido");
                    }
                    const consulta1 = await db.query(
                      `select * FROM solicitudes WHERE id_solicitud=? and usuarios_id_creador=?`, 
                      [id_solicitud, id_user]
                    );

                    const consulta2 = await db.query(
                      `select * FROM solicitudes WHERE id_solicitud=? and usuarios_id=?`, 
                      [id_solicitud, id_user]
                    );

                    const consulta3 = await db.query(
                      `select * from asociaciones_usuarios au inner join solicitudes as s on au.nit_asociacion_pk_fk = s.nit_asociacion_fk WHERE s.id_solicitud = ? and au.usuarios_id = ?`, 
                      [id_solicitud, id_user]
                    );

                    if(consulta1.length < 1 && consulta2.length < 1  && consulta3.length < 1){  
                      throw createError(401,"Usuario no autorizado, usted no realizó la solicitud");                  
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

async function getSolicitudesNoaceptadasPorAsociacion(token){
  let tipo_user=null;
  let id_user=null;
  if(token && validarToken(token)){
      let payload=helper.parseJwt(token);
      tipo_user= payload.rol;
      id_user= payload.sub;
      try{
          if(tipo_user!="Pescador" && tipo_user!="Piscicultor"){ 
            throw createError(401,"Usted no tiene autorización");
          }else{                
                    try{
                      const rows = await db.query(
                        `SELECT s.id_solicitud, e.id_estado, e.descripcion as estado, ss.id_sender_solicitud, ss.nombre as enviado_por,
                                concat(u.nombres,' ',u.apellidos) as usuario, u.foto, s.fecha, a.nombre as asociacion
                        FROM solicitudes as s inner join estados_solicitudes as e on s.id_estado_fk=e.id_estado
                                              inner join sender_solicitud as ss on s.id_sender_solicitud=ss.id_sender_solicitud
                                              inner join asociaciones as a on s.nit_asociacion_fk=a.nit
                                              inner join usuarios as u on s.usuarios_id=u.id
                        WHERE s.id_estado_fk=1 and s.id_sender_solicitud=1 and s.usuarios_id=? 
                        `, 
                        [id_user]
                      );                        
                        const data = helper.emptyOrRows(rows);
                        return { data };
                    }catch(err) {
                      throw err;
                    }
              }           
      }catch (error) {          
        throw error;
      } 
  }else{
    throw createError(401,"Usuario no autorizado");
  }
}/*End getSolicitudesNoaceptadasPorAsociacion*/

 /*_----------------------------------aceptarSolicitudAsociacion--------------------------------*/
 async function aceptarSolicitudAsociacion(id_solicitud,token){
  let message = '';
  if(token && validarToken(token)){ 
      const payload=helper.parseJwt(token);                             
      const tipo_user= payload.rol; 
      const id_user=payload.sub;
        try{      
          if(!(tipo_user==='Piscicultor' || tipo_user==='Pescador')){
              throw createError(401,"Tipo de usuario no Válido");
          }
                  if( id_solicitud===undefined)
                  {
                    throw createError(400,"Se requiere el identificador de la solicitud");
                  }
                  const rows = await db.query(
                    `SELECT * 
                     FROM solicitudes as s inner join usuarios as u on s.usuarios_id = u.id 
                     WHERE  u.id=? and s.id_solicitud=?
                    `, 
                    [id_user,id_solicitud]
                  );  
                  if(rows.length<1){
                      throw createError(401,"Usted no tiene autorización para actualizar la solicitud"); 
                  }               
                  const result = await db.query(
                    `UPDATE solicitudes
                    SET id_estado_fk=?,
                        usuarios_id=?
                    WHERE id_solicitud=?`,
                    [
                      2,
                      id_user,               
                      id_solicitud
                    ] 
                  );
            if(result.affectedRows){ 
                message = 'Solicitud actualizada exitosamente';
            }else{
                message='Error actualizando la solicitud del usuario';
            }
                return {message};
        } catch(error){
                  throw error;
        }
    }else{
      throw createError(401,"Usted no tiene autorización"); 
 }
}/*End aceptarSolicitudAsociacion*/

module.exports = {
  getAsociacionesDepartamento,
  getDetail,
  getMultiple,
  create,
  update,
  remove,
  enviarSolicitudAdicion,
  removeSolicitudAdicion,
  getAsociacionesMunicipio,
  getSolicitudesNoaceptadasPorAsociacion,
  aceptarSolicitudAsociacion,
  getAsociacionesMiembros
}