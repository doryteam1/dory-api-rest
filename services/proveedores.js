 const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');


async function getMultiple(page = 1,id_user){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT p.nombreProducto,p.precio, p.descripcion, p.imagen
     FROM productos p inner join productos_usuarios pu
                      on (p.codigo = pu.codigo_producto_pk_fk) and
                         (pu.usuarios_id = ?)
     LIMIT ?,?`, 
    [id_user, offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

/*-----------------------------------create de productos---------------------------------------------------*/


async function create(producto,token){
    console.log("producto ",producto)
   if(token && validarToken(token)){

       try {
            let payload=helper.parseJwt(token);
            let rol= payload.rol;
         
                if (rol=='Proveedor') {
                                      
                      const result = await db.query(
                        `INSERT INTO productos(codigo,nombreProducto,precio,descripcion,imagen) VALUES (?,?,?,?,?)`, 
                        [
                          producto.codigo,
                          producto.nombreProducto,
                          producto.precio,
                          producto.descripcion,
                          producto.imagen
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
         
                  if (rol=='Proveedor') {

                    if(producto.nombreProducto==undefined || producto.precio==undefined || producto.descripcion==undefined || producto.imagen==undefined){
                         throw createError(400,"Se requieren todos los parámetros!");
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
  remove
}