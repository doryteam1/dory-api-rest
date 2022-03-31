const db = require('./db');
const helper = require('../helper');
const bcrypt= require('bcrypt');
var createError = require('http-errors');
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID_1 = '482318580198-co5iamkudku3b4e0p2k83okrvk9dh9os.apps.googleusercontent.com';
const CLIENT_ID_2 = '170816600260-esagcgasnv4kkfdtl8ejftb5kiar6pkj.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
const ONE_YEAR_MILLISECONDS = 525600;

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
            
            if(verificar.length<1){
              throw createError(404,"Usuario no esta verificado ó no existe. Revise su correo electronico y siga las instrucciones.");
            }

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
                              var token=helper.createToken(rows[0],ONE_YEAR_MILLISECONDS);/*token de un año*/
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

async function loginWithGoogle(req){
  if(!req.body.token){
    throw createError(400,'Debe proporcionar un token.');
  }
  const token = req.body.token;
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [CLIENT_ID_1, CLIENT_ID_2]  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  let email = payload.email;

  const rows = await db.query('select * from usuarios as u left join tipos_usuarios as tu on u.id_tipo_usuario = tu.id_tipo_usuario where u.email = ?',[email]);
  console.log(rows)
  if(rows.length < 1){
    throw createError(400,'El usuario no esta registrado.');
  }

  if(payload.email_verified){
    if(!rows[0].estaVerificado){
      const result = await db.query(
        `UPDATE usuarios
          SET estaVerificado=?
          WHERE email=?`,
          [
            1,
            email
          ] 
      );
      console.log(result.affectedRows)
      if (result.affectedRows<1) {
        throw createError(500,"Ocurrio un problema al autenticar el usuario. Intentelo nuevamente");
      }
    }
  }else{
    throw createError(403,"Este usuario tiene un correo que aun no ha sido verificado por google. Verifique primero su correo y luego intente la operación nuevamente.");
  }

  try{
    const newToken = await helper.createToken(rows[0],ONE_YEAR_MILLISECONDS);  
    return {
      token: newToken,
      authenticated:true
    };
  }catch(err){
    console.log(err);
    throw err;
  }
}

module.exports = {
  createLogin,
  loginWithGoogle
}


   
    
