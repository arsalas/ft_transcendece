import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';

// @WebSocketGateway({ cors: true, namespace: '/' })
@WebSocketGateway({ cors: true, namespace: '/test' })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) { }

  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    console.log({ conectados: this.messagesWsService.getConnectedClients() })
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    console.log({ conectados: this.messagesWsService.getConnectedClients() })
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())

  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: any) {

  }
}
