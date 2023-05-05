import { Manager, Socket } from 'socket.io-client'

export const connectToServer = () => {
    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js')

    const socket = manager.socket('/test')

    addListeners(socket)
}

const addListeners = (socket: Socket) => {
    socket.on('connect', () => {
        console.log('connected')
    })

    socket.on('disconnect', () => {
        console.log('disconnect')
    })
    socket.on('clients-updated', (clients: string[]) => {
        console.log("clients-updated", clients)
    })
}
