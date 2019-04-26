//const io = require('socket.io')();
socket = io();
//var socket = io();

//var param = new URLSearchParams(window.location.search);

let usuarioConectado = null;

const setUsuarioConectado = (usuarioCompleto) =>
{
	usuarioConectado = usuarioCompleto;
	console.log("conectado = "+ usuarioConectado.nombre)
}

socket.on("connect", () =>{
	console.log("desde el connect = " + usuarioConectado.nombre);
	//socket.emit('usuarioNuevo', usuario)

})