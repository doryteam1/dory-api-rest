const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const nodemailer = require('nodemailer');
const res = require('express/lib/response');


async function enviarFormulario(formulario){

  const{nombre,email,celular,asunto,mensaje,}=formulario;
    
  contentHtml = `<h1 style="color:#26A5B8">Información del Usuario</h1>
               <ul>
               <li>nombre:${nombre}</li>
               <li>celular:${celular}</li>
               <li>email:${email}</li>
               </ul>
               <p>${mensaje}</p>
               `;


  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "plataforma.piscicola@gmail.com", // generated ethereal user
      pass: "krxg hgff tfqc bcry", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Remitente 👻" <plataforma.piscicola@gmail.com>', // user
    to: "ginelect@unisucre.edu.co", // list of receivers
    subject: asunto, // Subject line
    text: mensaje, // plain text body
    html: contentHtml, // html body
  });

  console.log("Mensaje enviado:", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


module.exports = {
  enviarFormulario
}