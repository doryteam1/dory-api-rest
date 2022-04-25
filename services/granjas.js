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

async function getGranjasMayorCalificacion(page = 1,idMunicipio){
  const offset = helper.getOffset(page, config.listPerPage);
  try{
     if(idMunicipio){    
          const rows = await db.query(
            `SELECT distinctrow g.id_granja, g.nombre, g.area, g.numero_trabajadores, g.produccion_estimada_mes, g.direccion, g.latitud, g.longitud, g.descripcion, g.id_departamento, g.id_municipio, g.id_corregimiento, g.id_vereda,
                                (select avg(puntuacion) from usuarios_granjas ug5 where g.id_granja=ug5.id_granja_pk_fk ) as puntuacion
             FROM granjas as g left join  usuarios_granjas as ug on (g.id_granja=ug.id_granja_pk_fk)
             WHERE g.id_municipio=? and g.anulado="creada"
             order by ug.puntuacion desc
            LIMIT ?,?`, 
            [idMunicipio, offset, config.listPerPage]
          );
          const data = helper.emptyOrRows(rows);
          const meta = {page};
          return {
            data,
            meta
          }
     }else{ 
       throw createError(400,"Se requiere el Id del Municipio");
     }
  }catch{
    throw error;
  }
}/*End getGranjasMayorCalificacion*/

async function getGranjasMayorArea(page = 1,idMunicipio){
  const offset = helper.getOffset(page, config.listPerPage);
  try{
     if(idMunicipio){    
          const rows = await db.query(
            `SELECT  g.id_granja, g.nombre, g.area, g.numero_trabajadores, g.produccion_estimada_mes, g.direccion, g.latitud, g.longitud, g.descripcion, g.id_departamento, g.id_municipio, g.id_corregimiento, g.id_vereda
            FROM granjas as g 
            WHERE g.id_municipio=? and g.anulado="creada"
            order by g.area desc
            LIMIT ?,?`, 
            [idMunicipio, offset, config.listPerPage]
          );
          const data = helper.emptyOrRows(rows);
          const meta = {page};
          return {
            data,
            meta
          }
     }else{ 
       throw createError(400,"Se requiere el Id del Municipio");
     }
  }catch{
    throw error;
  }
}/*End getGranjasMayorArea*/

async function getGranjasMenorArea(page = 1,idMunicipio){
  const offset = helper.getOffset(page, config.listPerPage);
  try{
     if(idMunicipio){    
          const rows = await db.query(
            `SELECT  g.id_granja, g.nombre, g.area, g.numero_trabajadores, g.produccion_estimada_mes, g.direccion, g.latitud, g.longitud, g.descripcion, g.id_departamento, g.id_municipio, g.id_corregimiento, g.id_vereda
            FROM granjas as g 
            WHERE g.id_municipio=? and g.anulado="creada"
            order by g.area asc
            LIMIT ?,?`, 
            [idMunicipio, offset, config.listPerPage]
          );
          const data = helper.emptyOrRows(rows);
          const meta = {page};
          return {
            data,
            meta
          }
     }else{ 
       throw createError(400,"Se requiere el Id del Municipio");
     }
  }catch{
    throw error;
  }
}/*End getGranjasMenorArea*/

async function create(body,token){
      console.log("inicio create")
      const conection= await db.newConnection(); 
      await conection.beginTransaction();
      console.log("inicio begin transaction")
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
                console.log("inicio query 1",body)
                 const result = await db.query(
                    `INSERT INTO granjas (nombre,area,numero_trabajadores, produccion_estimada_mes,direccion,latitud,longitud,descripcion,id_departamento,id_municipio,id_corregimiento,id_vereda,anulado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
                    [
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
                console.log("paso query 1")      
                  let message = {message: 'Error creando la granja'};                
                  if (result.affectedRows) {
                    message = {message:'Granja creada exitosamente'};
                  }
                  console.log("inicio query 1.a")
                  const rowsId = await db.query(
                    `SELECT MAX(id_granja) AS id FROM granjas`
                  ); 
                  console.log("paso query 1.a")
                var tiposInfraestructuras=JSON.parse(body.arrayTiposInfraestructuras);/*Pasar el string a vector*/
                 
                 for(var i=0;i<tiposInfraestructuras.length;i++){
                    await db.query(
                      `INSERT INTO infraestructuras_granjas(id_granja_pk_fk,id_infraestructura_pk_fk) VALUES (?,?)`,
                      [rowsId[0].id, tiposInfraestructuras[i]]
                    );
                 }

                 console.log("paso query 2")
                 var especies=JSON.parse(body.arrayEspecies);
                 
                 for(var j=0;j<especies.length;j++){
                    await db.query(
                      `INSERT INTO especies_granjas(id_especie_pk_fk,id_granja_pk_fk) VALUES (?,?)`,
                      [especies[j], rowsId[0].id]
                    );
                 }
                 console.log("paso query 3")
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
                console.log("paso query 4")
                await conection.commit(); 
                conection.release();
                return message;
          }catch (error) {
                await conection.rollback(); 
                conection.release();
                throw error;
          } 
     }else{
          throw createError(401,"Usted no tiene autorización"); 
     }
  }/*End Create*/

  /*granja,id-granja a modificar, token de usuario,array de id de tipos de infraestructuras de la granja actualizarlos, array de id de especies cultivadas actualizarlas*/
  async function update(idGranja, body, token){

    const conection= await db.newConnection(); 
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
                  idGranja
              ] 
            );          
            let message = 'Error actualizando la granja';          
            if (result.affectedRows) {
              message = 'Granja actualizada exitosamente';
            }             
                await db.query(
                  `DELETE FROM infraestructuras_granjas
                   WHERE id_granja_pk_fk=?`,
                  [idGranja]
                );/*Borrado de infraestructuras granjas para luego agregarlas nuevamente*/

                var tiposInfraestructuras=JSON.parse(body.arrayTiposInfraestructuras);
                 for(var i=0;i<tiposInfraestructuras.length;i++){
                    await db.query(
                      `INSERT INTO infraestructuras_granjas
                       (id_granja_pk_fk,id_infraestructura_pk_fk) VALUES (?,?)`,
                      [idGranja, tiposInfraestructuras[i]]
                    );
                 }
                        
                 await db.query(
                  `DELETE FROM especies_granjas
                   WHERE id_granja_pk_fk=?`,
                  [idGranja]
                );/*Borrado de especies de granjas para luego agregarlas nuevamente*/

                 var especies=JSON.parse(body.arrayEspecies);                 
                 for(var j=0;j<especies.length;j++){
                    await db.query(
                      `INSERT INTO especies_granjas 
                       (id_especie_pk_fk,id_granja_pk_fk) VALUES (?,?)`,
                      [especies[j], idGranja]
                    );
                 }

            await conection.commit(); 
            conection.release();
            return message;
      }catch (error) {
            await conection.rollback();  
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
                    `UPDATE granjas SET anulado = 'anulada' WHERE id_granja=?`, 
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
  }/*End anularGranja*/

  async function getGranjasDepartamento(page = 1){ 
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
      `SELECT distinctrow  m.id_municipio, m.nombre, m.poblacion,(SELECT count(*) FROM municipios as m1, granjas as g1 where m1.id_municipio=g1.id_municipio and m1.id_municipio=m.id_municipio) as count_granjas
       FROM  granjas as g, municipios as m, corregimientos as c,veredas as v
       WHERE  m.id_municipio=g.id_municipio or
        c.id_municipio=g.id_corregimiento or
        v.id_municipio=g.id_municipio LIMIT ?,?`, 
      [offset, config.listPerPage]
    );
    const data = helper.emptyOrRows(rows);
    const meta = {page};
  
    return {
      data,
      meta
    }
  }/*End getGranjasDepartamento*/

  async function getGranjasMunicipio(page = 1,idMunicipio){
     try{
        const offset = helper.getOffset(page, config.listPerPage);
        const rows = await db.query(
          `SELECT DISTINCT   g.id_granja, g.nombre,g.area, g.numero_trabajadores, g.produccion_estimada_mes, g.direccion,g.descripcion,f.id_foto,f.imagen,(select count(*) from reseñas r1,granjas g1 where r1.id_granja_pk_fk=g1.id_granja and r1.id_granja_pk_fk= g.id_granja) as count_reseñas,
                            (select avg(puntuacion) from usuarios_granjas ug5 where g.id_granja=ug5.id_granja_pk_fk ) as puntuacion
          FROM  granjas as g left join fotos as f on (f.id_granja_fk = g.id_granja)
                            left join usuarios_granjas as ug on (g.id_granja = ug.id_granja_pk_fk)      
          WHERE   g.id_municipio=? 
                LIMIT ?,?`, 
          [idMunicipio,offset, config.listPerPage]
        );
        var arrayfotos= new Array();
        var nuevoRows = new Array();
        var index= rows[0].id_granja;
        nuevoRows.push(rows[0]);
        
        rows.forEach((element)=>{ 
          
          if((index == element.id_granja))
          { 
            arrayfotos.push(element.imagen);
          }else { 
                    index= element.id_granja;
                    nuevoRows[nuevoRows.length-1].fotos=arrayfotos;/*Arreglo de fotos agregado al final del arreglo de granjas */
                    nuevoRows.push(element);
                    arrayfotos=[];  
                    arrayfotos.push(element.imagen);
          }
        });
          nuevoRows[nuevoRows.length-1].fotos=arrayfotos;
          
        const data = helper.emptyOrRows(nuevoRows);
        const meta = {page};
      
        return {
          data,
          meta
        }
    } catch{        
          throw createError(404,"No hay granjas en el municipio ingresado");
    }
  }/*End getGranjasMunicipio*/

  async function getDetail(page = 1,idGranja){
    const offset = helper.getOffset(page, config.listPerPage);
  
    const rows = await db.query(
      `SELECT g.id_granja, g.nombre, g.descripcion, g.area, g.numero_trabajadores, 
              g.produccion_estimada_mes, g.direccion, g.latitud, g.longitud, 
              g.id_departamento, g.id_municipio, g.id_corregimiento, g.id_vereda,
             (select count(*) from reseñas r1,granjas g1 where r1.id_granja_pk_fk=g1.id_granja and r1.id_granja_pk_fk= g.id_granja and g1.id_granja=g.id_granja) as count_resenas,
             (select avg(puntuacion) from usuarios_granjas ug5, granjas g5 where g5.id_granja=ug5.id_granja_pk_fk and g.id_granja=ug5.id_granja_pk_fk) as puntuacion
       FROM granjas as g
       WHERE  g.id_granja=?
             LIMIT ?,?`, 
      [idGranja,offset, config.listPerPage]
    );
  
    const rowsfotos = await db.query(
      `SELECT f.id_foto,f.imagen
       FROM  fotos as f
       WHERE f.id_granja_fk =?
        LIMIT ?,?`, 
     [idGranja,offset, config.listPerPage]
    );
  
  var arrayfotos= new Array();
  
  rowsfotos.forEach((element)=>{ 
    arrayfotos.push(element.imagen);
  });
  
    var nuevoRows = new Array();
    nuevoRows.push(rows[0]);
    nuevoRows[nuevoRows.length-1].fotos=arrayfotos;
  
     const rows1 = await db.query(
         `SELECT concat(u.nombres, " ", u.apellidos) as nombre_completo, u.direccion, u.celular
          FROM granjas as g, usuarios_granjas as ug, usuarios as u
          WHERE (u.id=ug.usuarios_id) and
           (g.id_granja=ug.id_granja_pk_fk) and
           (ug.espropietario=1) and
           g.id_granja=? LIMIT ?,?`,
           [idGranja,offset, config.listPerPage]
           );
  
           var arraypropietarios= new Array();
           rows1.forEach((element)=>{ 
            arraypropietarios.push(element);
            nuevoRows[nuevoRows.length-1].propietarios=arraypropietarios;/*Arreglo de propietarios agregado al final del arreglo de granjas */
     });
  
      const rows2 = await db.query(
        `select e.nombre 
         from granjas as g, especies_granjas as eg, especies as e
         where (e.id_especie=eg.id_especie_pk_fk) and 
               (eg.id_granja_pk_fk=g.id_granja) and 
                g.id_granja=? LIMIT ?,?`, 
        [idGranja,offset, config.listPerPage]
      );
  
      var arrayespecies= new Array();
  
      rows2.forEach((element)=>{ 
             arrayespecies.push(element.nombre);
             nuevoRows[nuevoRows.length-1].especies=arrayespecies;/*Arreglo de especies agregado al final del arreglo de granjas */
      });
  
      const rows3 = await db.query(
        `select i.nombre 
         from granjas as g, infraestructuras_granjas as ig, infraestructuras as i
         where (i.id_infraestructura=ig.id_infraestructura_pk_fk) and 
               (ig.id_granja_pk_fk=g.id_granja) and 
               g.id_granja=? LIMIT ?,?`, 
        [idGranja,offset, config.listPerPage]
      );
  
      var arrayinfraestructuras= new Array();
  
      rows3.forEach((element)=>{ 
             arrayinfraestructuras.push(element.nombre);
             nuevoRows[nuevoRows.length-1].infraestructuras=arrayinfraestructuras;/*Arreglo de especies agregado al final del arreglo de granjas */
      });
  
  
    const data = helper.emptyOrRows(nuevoRows);
    const meta = {page};
  
    return {
      data,
      meta
    }
  }/*getDetail*/
  
module.exports = {
  getMultiple,
  getGranjasMayorCalificacion,
  getGranjasMayorArea,
  getGranjasMenorArea,
  create,
  update,
  anularGranja,
  getGranjaUsuario,
  getGranjasDepartamento,
  getGranjasMunicipio,
  getDetail
}