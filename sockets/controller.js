const { Socket } = require('socket.io');
const { validarToken } = require('../middelware/auth');
const ChatMensajes = require('../models/chat-mensajes');
const helper = require('../helper');
const chatMensajes = new ChatMensajes();


const socketController = async( socket = new Socket(), io ) => {
    console.log(socket)
    const token = socket.handshake.auth.token;
    console.log(token)
    let valid = validarToken(token);
    if(!valid){
        socket.disconnect();
        console.log("Usuario no autorizado");
    }else{
        console.log("Usuario autorizado")
        let usuario = helper.parseJwt(token)
        // Agregar el usuario conectado
        let userDetail = await chatMensajes.conectarUsuario( usuario );
        io.emit('usuarios-activos',     chatMensajes.usuariosArr );
        socket.emit('recibir-mensajes', chatMensajes.ultimos10 );

        // Conectarlo a una sala especial
        socket.join( userDetail.id ); // global, socket.id, usuario.id
        

        // Limpiar cuando alguien se desconeta
        socket.on('disconnect', () => {
            chatMensajes.desconectarUsuario( usuario.sub );
            io.emit('usuarios-activos', chatMensajes.usuariosArr );
        })

        socket.on('new-message', ({ uid, mensaje }) => {
            console.log("message recived! uid ", uid)
        if ( uid ) {
            // Mensaje privado
            console.log("send message to ", uid)
            socket.to( uid ).emit( 'new-message', { usuario, mensaje });
        } 
        /* else {
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje );
            io.emit('recibir-mensajes', chatMensajes.ultimos10 );
        } */
        })
    
    }
}



module.exports = {
    socketController
}