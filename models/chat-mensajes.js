const usuario = require('../services/usuario');
class Mensaje {
    constructor( uid, nombre, mensaje ) {
        this.uid     = uid;
        this.nombre  = nombre;
        this.mensaje = mensaje;
    }
}


class ChatMensajes {

    constructor() {
        this.mensajes = [];
        this.usuarios = {};
    }

    get ultimos10() {
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }

    get usuariosArr() {
        return Object.values( this.usuarios ); // [ {}, {}, {}]
    }

    enviarMensaje( uid, nombre, mensaje ) {
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje)
        );
    }

    async conectarUsuario( usuario ) {
        let userDetail = await usuario.getUserId(1, idUser)
        this.usuarios[usuario.sub] = userDetail
    }

    desconectarUsuario( id ) {
        delete this.usuarios[id];
    }

}

module.exports = ChatMensajes;