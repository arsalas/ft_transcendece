import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameGateway } from './game.gateway';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameUser } from './entities';
import { DataSource, Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    userId: string;
  };
}

interface Queque {
  [id: string]: string[];
}

@Injectable()
export class GameService {
  private connectedClients: ConnectedClients = {};

  private queque: Queque = {
    original: [],
    speed: [],
  };

  constructor(
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway,

    private readonly dataSource: DataSource,

    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(GameUser)
    private readonly gameUserRepository: Repository<GameUser>,
  ) {}

  private checkUserConnection(userId: string) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];
      if (connectedClient.userId === userId) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }

  getUserIdByClient(clientId: string) {
    return this.connectedClients[clientId].userId;
  }

  getSocketByUserId(userId: string) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];
      if (connectedClient.userId === userId) {
        return connectedClient.socket;
      }
    }
  }

  registerClient(client: Socket, userId: string) {
    this.checkUserConnection(userId);
    this.connectedClients[client.id] = {
      socket: client,
      userId,
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  async create(createGameDto: CreateGameDto, userId: string) {
    // 1 - Buscar si existe algun jugador en cola
    const user = this.queque[createGameDto.type].shift();
    // 2.a - Si no existe crear una cola
    if (!user) {
      this.queque[createGameDto.type].push(userId);
      return;
    }
    // 2.b - Si existe crear la partida y avisar a los jugadores
    // Creamos una transaccion
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const game = this.gameRepository.create({
        startedAt: new Date(),
        type: createGameDto.type,
      });
      const gameData = await queryRunner.manager.save(game);
      const gameUser1 = this.gameUserRepository.create({
        userId: { login: userId },
        game: gameData,
      });
      const gameUser2 = this.gameUserRepository.create({
        userId: { login: user },
        game: gameData,
      });

      await queryRunner.manager.save([gameUser1, gameUser2]);
      // Si todo ha ido bien aplicamos los cambios
      await queryRunner.commitTransaction();
      this.getSocketByUserId(userId).join(`room_${gameData.id}`);
      this.getSocketByUserId(user).join(`room_${gameData.id}`);
      this.gameGateway.wss
        .to(`room_${gameData.id}`)
        .emit('game-start', gameData.id);
    } catch (error) {
      // Si ha fallado algo deshacemos los cambios
      await queryRunner.rollbackTransaction();
      throw new Error('Something is wrong');
    } finally {
      // Soltamos la conexion
      await queryRunner.release();
    }

    return 'This action adds a new game';
  }

  async getGame(gameId: string, userId: string) {
    console.log(gameId);
    const gameData = await this.gameUserRepository.find({
      relations: { userId: true },
      where: { game: { id: gameId } },
    });
    if (gameData.length < 2) throw new NotFoundException();
    const gameD = await this.gameRepository.findOneBy({ id: gameId });
    if (gameD.finishAt) throw new BadRequestException();
    const game = {
      id: gameId,
      players: gameData.map((g) => {
        return {
          login: g.userId.login,
          username: g.userId.username,
          avatar: g.userId.avatar,
          avatar42: g.userId.avatar42,
          coallition: g.userId.coallition,
          icon: g.userId.icon,
          color: g.userId.color,
        };
      }),
    };

    return game;
  }

  async finishGame(result: any) {
	const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const game = this.gameRepository.create({
        id: result.gameId,
        finishAt: new Date(),
      });
	  console.log(game) 
      const gameData = await queryRunner.manager.save(game);
	  const gameUser1 = this.gameUserRepository.create({
        userId: { login: result.scores[0].userId },
        game: gameData,
        result: result.scores[0].score,
      });
      const gameUser2 = this.gameUserRepository.create({
        userId: { login: result.scores[1].userId },
        game: gameData,
        result: result.scores[1].score,
      });

      await queryRunner.manager.save([gameUser1, gameUser2]);
      // Si todo ha ido bien aplicamos los cambios
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      // Si ha fallado algo deshacemos los cambios
      await queryRunner.rollbackTransaction();
      //   throw new Error('Something is wrong');
    } finally {
      // Soltamos la conexion
      await queryRunner.release();
    }
  }
}
