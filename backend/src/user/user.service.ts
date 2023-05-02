import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateUserDto } from './dto';
import { Profile, User } from './entities';
import { IAuth42 } from 'src/common/interfaces';

@Injectable()
export class UserService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
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

  /**
   * Crea un nuevo usuario y su perfil
   * @param user login42
   */
  async create(user42: IAuth42) {
    // Creamos una transaccion
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      const userRepo = this.userRepository.create({
        login: user42.login,
      });
      const profileRepo = this.profileRepository.create({ ...user42 });
      // await this.userRepository.save(userRepo);
      // await this.profileRepository.save(profileRepo);
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
}
