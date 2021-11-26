const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM chats LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


async function create(chat){
      const result = await db.query(
      `INSERT INTO chats(id_chat,fecha_creacion) VALUES (?,?)`, 
      [
        chat.id_chat,
        chat.fecha_creacion,
      ]
    );
  
    let message = 'Error creando chat';
  
    if (result.affectedRows) {
      message = 'chat creado exitosamente';
    }
  
    return {message};
  }

  async function update(id, chat){
    const result = await db.query(
      `UPDATE chats 
       SET fecha_creacion=? 
       WHERE id_chat=?`,
       [
         chat.fecha_creacion,
         id
       ] 
    );
  
    let message = 'Error actualizando chat';
  
    if (result.affectedRows) {
      message = 'chat actualizado exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM chats WHERE id_chat=?`, 
      [id]
    );
  
    let message = 'Error borrando chat';
  
    if (result.affectedRows) {
      message = 'chat borrado exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}