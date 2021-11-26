const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM productos LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


async function create(producto){
    const result = await db.query(
      `INSERT INTO productos(codigo, nombreProducto,precio,descripcion,imagen) VALUES (?,?,?,?,?)`, 
      [
        producto.codigo,
        producto.nombreProducto,
        producto.precio,
        producto.descripcion,
        producto.imagen
      ]
    );
  
    let message = 'Error creando producto';
  
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'producto creada exitosamente'};
    }
  
    return {message};
  }

  async function update(codigo, producto){
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
  }
  
  async function remove(codigo){
    const result = await db.query(
      `DELETE FROM productos WHERE codigo=?`, 
      [codigo]
    );
  
    let message = 'Error borrando producto';
  
    if (result.affectedRows) {
      message = 'producto borrado exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}