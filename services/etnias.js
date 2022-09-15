const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');

/*_____________________ getAreaExperticia______________________________________________*/
async function getEtnias(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM etnias LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};
  return {
    data,
    meta
  }
}/*End getAreaExperticia*/


/*_____________________ createAreaExperticia______________________________________________*/
async function createEtnia(etnia){
        if(etnia.id_area === undefined || 
           etnia.nombre === undefined ||
           etnia.descripcion === undefined ){
                throw createError(400,"Debe enviar todos los datos requeridos para el registro del área de experticia");
        }
          try{
                const result = await db.query(
                  `INSERT INTO areas_experticias(id_area,nombre,descripcion) VALUES (?,?,?)`, 
                  [
                    etnia.id_area,
                    etnia.nombre, 
                    etnia.descripcion
                  ]
                );  
                let message = 'Error creando la etnia';  
                if (result.affectedRows) {
                  message = 'Etnia creada exitosamente';
                }else {
                      throw createError(500,"Ocurrió un problema al registrar un aárea de experticia");
                }
            }catch(err){
              throw err;
            }      
            return {message};
  }/*End createAreaExperticia*/

  /*_____________________ updateAreaExperticia______________________________________________*/
  async function updateEtnia(id, etnia){
          if( 
            etnia.nombre === undefined ){
                throw createError(400,"Debe enviar todos los datos requeridos para la actualización de la etnia");
          }
            const result = await db.query(
            `UPDATE etnias
            SET nombre=? 
            WHERE id=?`,
            [
              etnia.nombre, 
              id
            ] 
          );  
          let message = 'Error actualizando la etnia';  
          if (result.affectedRows) {
            message = 'Etnia actualizada exitosamente';
          }  
          return {message};
  }/*End updateAreaExperticia*/
  
  /*______________________ removeEtnia_______________________________*/
  async function removeEtnia(id){
        const result = await db.query(
          `DELETE FROM etnias WHERE id=?`, 
          [id]
        );  
        let message = 'Error borrando la etnia';  
        if (result.affectedRows) {
          message = 'Etnia borrada exitosamente';
        }  
        return {message};
  }/*End removeEtnia*/

module.exports = {
  getEtnias,
  createEtnia,
  updateEtnia,
  removeEtnia
}