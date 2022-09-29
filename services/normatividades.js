const db = require('./db');
const helper = require('../helper');
const config = require('../config');
/*___________________________getMultiple___________________________________________*/
async function getMultiple(page = 1){
      const offset = helper.getOffset(page, config.listPerPage);
      const rows = await db.query(
        `SELECT normatividades.id as id_normatividad, concat(tipos_normatividades.nombre,' ',normatividades.nombre) as nombre,  normatividades.contenido AS contenido,normatividades.url_descarga AS url_descarga, normatividades.id_tipo_fk as id_tipo,tipos_normatividades.nombre AS tipo, normatividades.fecha as fecha
        FROM normatividades,tipos_normatividades
        WHERE normatividades.id_tipo_fk=tipos_normatividades.id_tipo LIMIT ?,?`, 
        [offset, config.listPerPage]
      );
      const data = helper.emptyOrRows(rows);
      const meta = {page};
      return {
        data,
        meta
      }
}/*End getMultiple*/

/*____________________getNormatividadesCadena________________________________________________*/
async function getNormatividadesCadena(page = 1, cadena){
        const offset = helper.getOffset(page, config.listPerPage);
        let cad= '%'+cadena+'%';
        const rows = await db.query(
          `SELECT  concat(tn.nombre," ",n.nombre) as nombre, n.contenido, n.url_descarga, n.fecha, tn.id_tipo as tipo
          FROM tipos_normatividades as tn, normatividades n
          WHERE (n.id_tipo_fk=tn.id_tipo) and 
                (tn.nombre  like ? or n.nombre like ? or n.contenido like ? )
          LIMIT ?,?`, 
          [cad,cad, cad, offset, config.listPerPage]
        );
        const data = helper.emptyOrRows(rows);
        const meta = {page};
        return {
          data,
          meta
        }
}/*End getNormatividadesCadena*/

/*_______________________ getNormatividadesTipo_________________________________*/
async function getNormatividadesTipo(page = 1, tipo){
      const offset = helper.getOffset(page, config.listPerPage);
      let tipoNormatividad= '%'+tipo+'%';
      const rows = await db.query(
        `SELECT  concat(tn.nombre," ",n.nombre) as nombre, n.contenido, n.url_descarga, n.fecha, tn.id_tipo as tipo
        FROM tipos_normatividades as tn, normatividades n
        WHERE n.id_tipo_fk=tn.id_tipo and 
              tn.nombre like ?
        LIMIT ?,?`, 
        [tipoNormatividad, offset, config.listPerPage]
      );
      const data = helper.emptyOrRows(rows);
      const meta = {page};
      return {
        data,
        meta
      }
}/*End getNormatividadesTipo*/

/*___________________________create___________________________________________*/
async function create(normatividad,token){
    try{
            if(token && validarToken(token)){
                    let payload=helper.parseJwt(token);
                    let tipo_user= payload.rol; 
                  if(tipo_user!='Administrador'){
                          throw createError(401,"Usted no tiene autorización para registrar eventos");
                  }
                  if(                     
                      normatividad.nombre===undefined ||  
                      normatividad.contenido===undefined || 
                      normatividad.url_descarga===undefined || 
                      normatividad.id_tipo_fk===undefined || 
                      normatividad.fecha===undefined                   
                    )
                    {
                      throw createError(400,"Se requieren todos los parámetros de la normatividad");
                    }
                  const result = await db.query(
                    `INSERT INTO normatividades(nombre, contenido,url_descarga,id_tipo_fk,fecha) VALUES (?,?,?,?,?)`, 
                    [
                    normatividad.nombre, 
                    normatividad.contenido,
                    normatividad.url_descarga, 
                    normatividad.id_tipo_fk,
                    normatividad.fecha       
                    ]
                  );  
                  let message = 'Error creando normatividad';  
                  if (result.affectedRows) {
                    message = 'La normatividad se registro exitosamente';
                  }  
                  return {message};
            }else{ 
                  throw createError(401,"Usted no tiene autorización"); 
            }
     }catch{
             throw error;
     }
  }/*End create*/

  /*___________________________update___________________________________________*/
  async function update(id, normatividad, token){
        try{
              if(token && validarToken(token)){
                      let payload=helper.parseJwt(token);
                      let tipo_user= payload.rol; 
                    if(tipo_user!='Administrador'){
                            throw createError(401,"Usted no tiene autorización para registrar eventos");
                    }
                  const result = await db.query(
                    `UPDATE normatividades
                    SET nombre=?,
                        contenido=?,
                        url_descarga=?, 
                        id_tipo_fk=?,
                        fecha=?
                    WHERE id=?`,
                    [
                      normatividad.nombre, 
                      normatividad.contenido,
                      normatividad.url_descarga, 
                      normatividad.id_tipo_fk,
                      normatividad.fecha,
                      id
                    ] 
                  );  
                  let message = 'Error actualizando normatividad';  
                  if (result.affectedRows) {
                    message = 'Registro de normatividad actualizado exitosamente';
                  }  
                  return {message};
              }else{ 
                  throw createError(401,"Usted no tiene autorización"); 
              }
        }catch{
                throw error;
        }
  }/*End update*/
 
/*___________________________remove___________________________________________*/  
  async function remove(id,token){
          try{
                if(token && validarToken(token)){
                        let payload=helper.parseJwt(token);
                        let tipo_user= payload.rol; 
                      if(tipo_user!='Administrador'){
                              throw createError(401,"Usted no tiene autorización para registrar eventos");
                      }
                      const result = await db.query(
                        `DELETE FROM normatividades WHERE id=?`, 
                        [id]
                      );  
                      let message = 'Error borrando normatividad';  
                      if (result.affectedRows) {
                        message = 'Registro de normatividad borrado exitosamente';
                      }  
                      return {message};
                }else{ 
                      throw createError(401,"Usted no tiene autorización"); 
                }
            }catch{
                    throw error;
            }     
  }/*End remove*/

module.exports = {
  getMultiple,
  getNormatividadesCadena,
  getNormatividadesTipo,
  create,
  update,
  remove
}