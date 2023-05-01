import { Repository } from 'typeorm';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { User, Profile } from '../user/entities';
import { UserService } from 'src/user/user.service';
import { Api42Service, TfaService } from 'src/common/services';
import { ConfirmTFADto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    // @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private jwtService: JwtService,
    private userService: UserService,
    private tfaService: TfaService,
    private api42Service: Api42Service,
  ) {}

  /**
   * Genera una imagen QR con una clave para el usuario
   * @param user
   * @param secret
   * @returns
   */
  public async generateTFASecret(login: string): Promise<{ qr: string }> {
    try {
      const user = await this.userService.findUser(login);
      if (!user) throw new HttpException('User not found', 404);
      if (user.twoFactorAuth) throw new HttpException('Unauthorized', 400);
      const { secret, qr } = await this.tfaService.generateSecret(login);
      await this.userRepository.update({ login }, { secret });
      return { qr };
    } catch (error) {
      throw new HttpException('Something is wrong', 500);
    }
  }

  /**
   * Activa la autenticacion en 2 factores
   * @param user
   * @param token
   * @returns
   */
  public async activateTFASecret(login: string, token: string) {
    try {
      const user = await this.userService.findUser(login);
      if (!user) throw new HttpException('User not found', 403);
      if (!this.tfaService.verify(user.secret, token))
        throw new HttpException('Unauthorized', 401);
      await this.userRepository.update({ login }, { twoFactorAuth: true });
    } catch (error) {
      throw new HttpException('Something is wrong', 500);
    }
  }

  /**
   * Desactiva la autenticacion en 2 factores
   * @param user
   * @param token
   * @returns
   */
  public async desactivateTFASecret(login: string, token: string) {
    try {
      const user = await this.userService.findUser(login);
      if (!user) throw new HttpException('User not found', 403);
      if (!this.tfaService.verify(user.secret, token))
        throw new HttpException('Unauthorized', 401);
      await this.userRepository.update({ login }, { twoFactorAuth: false });
    } catch (error) {
      throw new HttpException('Something is wrong', 500);
    }
  }

  /**
   * Obtiene el usuario o lo crea si no existe
   * @param code
   * @returns
   */
  async signIn(code: string) {
    // Intentamos hacer el signIn
    try {
      const user42 = await this.api42Service.signIn(code);
      let user = await this.userService.findUser(user42.login);
      // Si no existe el usuario se crea
      if (!user) {
        try {
          await this.userService.create(user42.login, user42.image.link);
        } catch (error) {
          throw new HttpException('Something is wrong', 500);
        }
        user = this.userRepository.create({ login: user42.login });
      }

      // Comprobar si tiene TFA
      if (user.twoFactorAuth) {
        return {
          twoFactorAuth: true,
          login: user.login,
          avatar42: user42.image.link,
        };
      }
      return this.getUserAuth(user, user42.image.link);
    } catch (error) {
      console.log(error);
      throw new HttpException('Something is wrong', 500);
    }
  }

  async confirmTFA(confirmTFADTO: ConfirmTFADto) {
    try {
      const user: User = await this.userService.findUser(confirmTFADTO.login);

      if (!this.tfaService.verify(user.secret, confirmTFADTO.token))
        throw new HttpException('Unauthorized', 401);
      return this.getUserAuth(user, confirmTFADTO.avatar42);
    } catch (error) {
      throw new HttpException('Unauthorized', 401);
    }
  }

  async recoverSession(login: string, avatar42: string) {
    const user = await this.userService.findUser(login);
    if (!user) throw new HttpException('User not found', 404);
    return await this.getUserAuth(user, avatar42);
  }

  private async getUserAuth(user: User, avatar42: string) {
    const profile: Profile = await this.userService.findProfile(user.login);
    if (!profile) throw new HttpException('User not found', 403);

    // Tanto si existe el usuario como si se ha creado de nuevo, creamos el payload y el token
    const payload = { login: user.login, avatar42 };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    // Comprobamos si tiene un avatar para unir el path de la url de la imagen
    if (profile.avatar)
      profile.avatar = 'http://localhost:3000/image/' + profile.avatar;

    return {
      token,
      user: {
        login: user.login,
        avatar42: profile.avatar42,
        username: profile.username,
        avatar: profile.avatar,
        twoFactorAuth: user.twoFactorAuth,
        status: profile.status,
      },
    };
  }
}
