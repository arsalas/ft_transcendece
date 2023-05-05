import { Manager, Socket } from 'socket.io-client'


// TODO Crear varias conexiones a diferentes namespaces?
// Sockets con nofificaciones, game, chat 

export const connectToServer = () => {
    //Gestion de las conexiones a los sockets
    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js')

    const socket = manager.socket('/test')

    addListeners(socket)
}

// Eventos que va a escuchar el socket
const addListeners = (socket: Socket) => {
    // Escucha el evento cuando el cliente se conecta
    socket.on('connect', () => {
        console.log('connected')
    })

    // Escucha el evento cuando el cliente se desconecta
    socket.on('disconnect', () => {
        console.log('disconnect')
    })

    // Escucha el evento clients-updated
    socket.on('clients-updated', (clients: string[]) => {
        console.log("clients-updated", clients)
    })

}
