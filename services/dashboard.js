const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

async function getDashboard(){
         try{
                  const conection= await db.newConnection(); /*conection of TRANSACTION */
                  await conection.beginTransaction();
                  let cantidadGranjas = await conection.execute(
                  `SELECT count(*) as Granjas
                    FROM granjas 
                    `, 
                    []
                  );
                  let data={};
                  let Granjas=cantidadGranjas[0]; console.log(cantidadGranjas[0]);

                    let cantidadAsociaciones = await conection.execute(
                    `SELECT count(*) as Asociaciones
                      FROM asociaciones 
                      `, 
                      []
                    );  console.log(cantidadAsociaciones[0]);
                    
                      let cantidadpescadores = await conection.execute(
                      `SELECT count(*) as Pescadores
                       FROM usuarios as u left join tipos_usuarios as tu on u.id_tipo_usuario=tu.id_tipo_usuario
                       WHERE tu.nombre_tipo_usuario like('%Pescador%')
                      `, 
                        []
                      ); console.log(cantidadpescadores[0]);

                      let cantidadpiscicultores = await conection.execute(
                      `SELECT count(*) as Piscicultores
                         FROM usuarios as u left join tipos_usuarios as tu on u.id_tipo_usuario=tu.id_tipo_usuario
                         WHERE tu.nombre_tipo_usuario like('%Piscicultor%')
                        `, 
                          []
                      ); console.log(cantidadpiscicultores[0]);

                      let cantidadusuarios = await conection.execute(
                          `SELECT count(*) as Usuarios
                           FROM usuarios 
                          `, 
                            []
                      ); console.log(cantidadusuarios[0]);

                   data={Granjas:cantidadGranjas[0]['Granjas'] , Asociaciones:cantidadAsociaciones[0] , Pescadores:cantidadpescadores[0],
                             Piscicultores:cantidadpiscicultores[0],Usuarios:cantidadusuarios[0]
                          };
                          console.log (data);
                  await conection.commit(); 
                        conection.release();         
                  return {data};
            }catch(error){
                   throw error;
            }
}/* const data = helper.emptyOrRows(rows);*/

module.exports = {
  getDashboard
} 