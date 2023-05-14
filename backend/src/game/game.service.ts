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
import { IHistoryGame } from 'src/user/interfaces';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    userId: string;
    room: string | undefined;
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
        console.log('desconect');
        connectedClient.socket.disconnect();
        break;
      }
    }
  }

  getUserIdByClient(clientId: string) {
    return this.connectedClients[clientId].userId;
  }

  getUserClientById(userId: string) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];
      if (connectedClient.userId === userId) {
        return clientId;
      }
    }
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
      room: undefined,
    };
  }

  async removeClient(clientId: string) {
    const user = this.connectedClients[clientId];
    console.log('disconn: ', user.room);
    if (user.room)
      this.gameGateway.wss
        .to(`room_${user.room}`)
        .emit('player-exit', { user: user.userId, gameId: user.room });
    delete this.connectedClients[clientId];
  }

  async create(createGameDto: CreateGameDto, userId: string) {
    console.log('cola: ', this.queque[createGameDto.type]);
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
      console.log('create game: ', gameData);
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
      console.log('id: ', gameData.id);
      console.log('clients: ', this.connectedClients);
      this.getSocketByUserId(userId).join(`room_${gameData.id}`);
      this.getSocketByUserId(user).join(`room_${gameData.id}`);
      this.connectedClients[this.getUserClientById(userId)].room = gameData.id;
      this.connectedClients[this.getUserClientById(user)].room = gameData.id;
      this.gameGateway.wss
        .to(`room_${gameData.id}`)
        .emit('game-start', gameData.id);
    } catch (error) {
      console.log(error);
      // Si ha fallado algo deshacemos los cambios
      await queryRunner.rollbackTransaction();
      throw new Error('Something is wrong');
    } finally {
      // Soltamos la conexion
      await queryRunner.release();
    }

    return 'This action adds a new game';
  }

  async getGame(gameId: string) {
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
      console.log(game);
      const gameData = await queryRunner.manager.save(game);
      const gameUser1 = this.gameUserRepository.create({
        userId: { login: result.scores[0].userId },
        game: gameData,
        result: result.scores[0].score,
        isWinner: result.scores[0].isWinner,
      });
      const gameUser2 = this.gameUserRepository.create({
        userId: { login: result.scores[1].userId },
        game: gameData,
        result: result.scores[1].score,
        isWinner: result.scores[1].isWinner,
      });

      await queryRunner.manager.update(
        GameUser,
        { userId: gameUser1.userId.login, game: gameUser1.game.id },
        gameUser1,
      );
      await queryRunner.manager.update(
        GameUser,
        { userId: gameUser2.userId.login, game: gameUser2.game.id },
        gameUser2,
      );
      //   await queryRunner.manager.save([gameUser1, gameUser2]);
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
    this.gameGateway.wss.emit('finish-game', result);
    this.gameGateway.wss.socketsLeave(`room_${result.gameId}`);
  }

  async getHistoryByUser(userId: string) {
    try {
      const games = await this.gameUserRepository.find({
        relations: { game: true },
        select: {
          isWinner: false,
          id: false,
          result: false,
          game: { id: true },
        },
        where: {
          userId: { login: userId },
        },
      });
      console.log({ games });
      if (games.length == 0) return [];
      const gameArr = games.map((g) => ({ game: { id: g.game.id } }));
      //  return gameArr
      const history = await this.gameUserRepository.find({
        relations: { game: true, userId: true },
        take: 10,
        // skip: 5,
        order: {
          game: { finishAt: 'DESC' },
        },
        where: [...gameArr],
      });

      const historyData: IHistoryGame[] = [];

      history.map((h) => {
        const index = historyData.findIndex((hd) => hd.id == h.game.id);
        if (index == -1) {
          const data: IHistoryGame = {
            id: h.game.id,
            date: h.game.startedAt,
            type: h.game.type,
            playerLeft: {
              profile: h.userId,
              isWinner: h.isWinner,
              result: h.result,
            },
          };

          if (data.playerLeft.profile.avatar)
            data.playerLeft.profile.avatar =
              process.env.WEB_URL + '/image/' + data.playerLeft.profile.avatar;

          historyData.push(data);
        } else {
          historyData[index].playerRight = {
            profile: h.userId,
            isWinner: h.isWinner,
            result: h.result,
          };
          if (historyData[index].playerRight.profile.avatar)
            historyData[index].playerRight.profile.avatar =
              process.env.WEB_URL +
              '/image/' +
              historyData[index].playerRight.profile.avatar;
        }
      });

      return historyData;
    } catch (error) {
      console.log(error);
    }
  }

  async getStadisticsByUser(userId: string) {
    try {
      const games = await this.gameUserRepository.find({
        relations: { game: true },
        select: {
          isWinner: false,
          id: false,
          result: false,
          game: { id: true },
        },
        where: {
          userId: { login: userId },
        },
      });
      const stadistics = { victories: 0, defeats: 0 };
      games.map((game) => {
        if (game.isWinner) stadistics.victories++;
        else stadistics.defeats++;
      });
      return stadistics;
    } catch (error) {
      console.log(error);
    }
  }

  async disconnectClient(userId: string) {
    // const clientId = this.getUserClientById(userId);
    // this.removeClient(clientId);
    // console.log(this.connectedClients)
  }
}
