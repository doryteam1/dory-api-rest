const { Socket } = require('socket.io');
const { ValidarToken } = require('../middelware/auth');
const { ChatMensajes } = require('../models/chat-mensajes');

const chatMensajes = new ChatMensajes();


const socketController = async( socket = new Socket(), io ) => {
    const token = socket.handshake.auth.token;
    console.log(token)
    let valid = validarToken(token);
    if(!valid){
        socket.disconnect();
        console.log("Usuario no autorizado");
    }else{
        console.log("Usuario autorizado")
    }

    // Agregar el usuario conectado
    /* chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos',     chatMensajes.usuariosArr );
    socket.emit('recibir-mensajes', chatMensajes.ultimos10 ); */

    // Conectarlo a una sala especial
    //socket.join( usuario.id ); // global, socket.id, usuario.id
    

    // Limpiar cuando alguien se desconeta
    /* socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr );
    }) */

    /* socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        
        if ( uid ) {
            // Mensaje privado
            socket.to( uid ).emit( 'mensaje-privado', { de: usuario.nombre, mensaje });
        } else {
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje );
            io.emit('recibir-mensajes', chatMensajes.ultimos10 );
        }

    })
 */
    
}



module.exports = {
    socketController
}