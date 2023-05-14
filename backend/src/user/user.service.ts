import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateUserDto } from './dto';
import { Profile, User, UserStatus } from './entities';
import { IAuth42 } from 'src/common/interfaces';
import { IStadistics, IUserProfile } from './interfaces';
import { GameService } from 'src/game/game.service';
import { Game, GameUser } from 'src/game/entities';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private gameService: GameService,
    // @InjectRepository(Game)
    // private gameRepository: Repository<Game>,
    // @InjectRepository(GameUser)
    // private gameUserRepository: Repository<GameUser>,

    private readonly configService: ConfigService,
  ) {}

  /**
   * Busca un usuario a partir del login de 42
   * @param login login42
   * @returns user
   */
  async findUser(login: string): Promise<User> {
    return await this.userRepository.findOneBy({ login });
  }

  async findProfile(login: string): Promise<Profile> {
    return await this.profileRepository.findOneBy({ login });
  }

  async findProfileByUsername(username: string): Promise<IUserProfile> {
    const profile = await this.profileRepository.findOneBy({ username });

    if (profile.avatar)
      profile.avatar =
        this.configService.get<string>('webURL') + '/image/' + profile.avatar;

    const history = await this.gameService.getHistoryByUser(profile.login);

    const stadistics: IStadistics = await this.gameService.getStadisticsByUser(
      profile.login,
    );
    return { profile, history, stadistics };
  }

  /**
   * Crea un nuevo usuario y su perfil
   * @param user42 login42
   */
  async create(user42: IAuth42) {
    // Creamos una transaccion
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userRepo = this.userRepository.create({
        login: user42.login,
      });
      const profileRepo = this.profileRepository.create({
        ...user42,
        status: UserStatus.ONLINE,
      });
      await queryRunner.manager.save(userRepo);
      await queryRunner.manager.save(profileRepo);
      // Si todo ha ido bien aplicamos los cambios
      await queryRunner.commitTransaction();
    } catch (error) {
      // Si ha fallado algo deshacemos los cambios
      await queryRunner.rollbackTransaction();
      throw new Error('Something is wrong');
    } finally {
      // Soltamos la conexion
      await queryRunner.release();
    }
  }

  async updateUser(
    login: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<Profile> {
    let profile: Profile = await this.profileRepository.findOneBy({
      login,
    });
    if (!profile) throw new HttpException('User not found', 404);
    try {
      profile = { ...profile, ...updateUserDto };
      if (file) profile.avatar = file.filename;
      const res = await this.profileRepository.update(
        { login },
        { ...updateUserDto, avatar: profile.avatar },
      );
      // "generatedMaps": [],
      // "raw": [],
      // "affected": 1
      if (profile.avatar)
        profile = {
          ...profile,
          avatar:
            this.configService.get<string>('webURL') +
            '/image/' +
            profile.avatar,
        };
      return profile;
    } catch (error) {
      throw new HttpException('Something is wrong', 500);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code == '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
