 const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

async function ObtenerTodosProductos(){         
               let row = await db.query(
                `SELECT p.codigo as codigo_producto,p.nombreProducto as nombre_producto,p.precio,p.descripcion,p.imagen,p.usuarios_id as id_proveedor,(select concat(u.nombres,'',u.apellidos))as proveedor
                FROM productos as p inner join usuarios as u on p.usuarios_id = u.id
                `,               
                []
                );
                const data = helper.emptyOrRows(row);
                return {
                  data
                }
}/*End ObtenerTodosProductos*/

async function getMultiple(id_user){
   const rows = await db.query(
    `SELECT p.codigo,p.nombreProducto,p.precio, p.descripcion, p.imagen
     FROM productos p 
     WHERE p.usuarios_id = ?`, 
    [id_user]
  );
  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}

/*-----------------------------------create de productos---------------------------------------------------*/
async function create(producto,token){    
   if(token && validarToken(token)){
       try {
            let payload=helper.parseJwt(token);
            let rol= payload.rol;         
                if (rol=='Proveedor') {                                      
                      const result = await db.query(
                        `INSERT INTO productos(nombreProducto,precio,descripcion,imagen,usuarios_id) VALUES (?,?,?,?,?)`, 
                        [
                          producto.nombreProducto,
                          producto.precio,
                          producto.descripcion,
                          producto.imagen,
                          payload.sub
                        ]
                      );                  
                    let message = 'Error al registrar el producto';                  
                    if (result.affectedRows) {
                      message = {  insertId: result.insertId, message:'producto creado exitosamente'};
                    }                    
                    return {message};
                }else {
                  throw createError(401,"tipo de usuario no autorizado");
                }
            } catch (error) {
                if(!(error.statusCode=='401')){
                      throw createError(500,"Un problema registrando el producto del usuario");
                    }else{
                      throw createError(401,"tipo de usuario no autorizado"); 
                    }    
            }         
    } else {
           throw createError(401,"Usted no tiene autorización"); 
        }
}/*--End create productos-------*/

/*-----------------------------------update de productos---------------------------------------------------*/
  async function update(codigo, producto, token){
    if(token && validarToken(token)){
          try{
            let payload=helper.parseJwt(token);
            let rol= payload.rol;
            let id_user= payload.sub;
                  if (rol=='Proveedor') {
                    if(producto.nombreProducto==undefined || producto.precio==undefined || producto.descripcion==undefined || producto.imagen==undefined){
                         throw createError(400,"Se requieren todos los parámetros!");
                    }
                    const rows = await db.query(
                      `SELECT *
                      FROM productos as p
                      Where p.codigo=? and usuarios_id=?`, 
                      [codigo,id_user]
                    );

                    if(rows.length<1){
                      throw createError(401,"Usted no esta autorizado para modificar éste producto");
                    }
                      const result = await db.query(
                        `UPDATE productos 
                        SET nombreProducto=?,
                            precio=?,
                            descripcion=?,
                            imagen=? 
                        WHERE codigo=?`,
                        [
                          producto.nombreProducto,
                          producto.precio,
                          producto.descripcion, 
                          producto.imagen,
                          codigo
                        ] 
                      );                    
                      let message = 'Error actualizando producto';                    
                      if (result.affectedRows) {
                        message = 'producto actualizado exitosamente';
                      }                    
                      return {message};
                  }else {
                    throw createError(401,"tipo de usuario no autorizado");
                  }
          } catch (error) {
                        if((error.statusCode!='500')){
                              throw error;  
                        }else{
                            throw createError(500,"Un problema actualizando el producto del usuario");
                        }
             }                   
   } else {
            throw createError(401,"Usted no tiene autorización"); 
        }
  }/*--End update productos----*/

  /*-----------------------------------remove de productos---------------------------------------------------*/  
  async function remove(codigo,token){
    if(token && validarToken(token)){
        try{
              let payload=helper.parseJwt(token);
              let rol= payload.rol;
                    if (rol=='Proveedor') {
                        const result = await db.query(
                          `DELETE FROM productos WHERE codigo=?`, 
                          [codigo]
                        );                      
                        let message = 'Error borrando el producto de proveedor';
                        if (result.affectedRows) {
                          message = 'producto borrado exitosamente';
                          return {message};
                        }else{
                          throw createError(404,"El recurso que desea eliminar no existe");
                        }                                          
                    }else {
                        throw createError(401,"tipo de usuario no autorizado");
                    }
         } catch (error) {               
                    if((error.statusCode!='500')){
                            throw error;  
                    }else{
                        throw createError(500,"Un problema eliminando el producto del usuario");
                    }
         }
    } else{
           throw createError(401,"Usted no tiene autorización"); 
        }

  }/*--End Remove productos----*/

module.exports = {
  getMultiple,
  create,
  update,
  remove,
  ObtenerTodosProductos
}