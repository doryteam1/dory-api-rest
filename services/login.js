const db = require('./db');
const helper = require('../helper');
const bcrypt= require('bcrypt');
var createError = require('http-errors');

async function createLogin(user){

  let email=user.email;
  let message = "El usuario no esta registrado o la contraseña es inválida";
  
  if(email!=undefined && email!=null)
  {
    /*verifico si el usuario estaverificado = 1 para permitir loguearse*/
            let verificar = await db.query(
              `SELECT u.estaVerificado
              FROM usuarios as u
              WHERE u.estaVerificado=1 and
                    u.email=? 
              `, 
              [email]
            );
            console.log("estaVerificado=",verificar[0].estaVerificado);
        if(verificar[0].estaVerificado!=null && verificar[0].estaVerificado!=0 && verificar[0].estaVerificado!=undefined){
                try {
                      const rows = await db.query(
                        `SELECT u.password,u.email,u.id,tu.nombre_tipo_usuario
                        FROM usuarios as u, tipos_usuarios as tu
                        WHERE u.id_tipo_usuario=tu.id_tipo_usuario and
                              u.email=? 
                        `, 
                        [email]
                      );
                                        
                      if(rows!=null && rows.length>0){
                    
                        let pass=rows[0].password;
                        let passUser=user.password;

                        if(( bcrypt.compareSync(passUser,pass))){
                              var token=helper.createToken(rows[0]);
                            return {token:token};
                        }
                      }
                        throw createError(404,"Usuario no existe");

                }catch{
                        throw createError(401,"Usuario No tiene autorización");
                }
        }else{
              throw createError(401,message);
        }
      }
      throw createError(400,message);
        
}//fin método


module.exports = {
  createLogin
}


   
    
