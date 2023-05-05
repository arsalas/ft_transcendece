import { Injectable } from '@nestjs/common';

import { authenticator } from 'otplib';

import { ImageHelpers } from 'src/image/image.helpers';

@Injectable()
export class TfaService {
  constructor(private imageHelpers: ImageHelpers) {}

  /**
   * Genera una imagen QR con una clave para el usuario
   * @param user
   * @param secret
   * @returns
   */
  async generateSecret(user: string) {
    const secret = authenticator.generateSecret();
    const otp = authenticator.keyuri(user, 'Cyberpong TFA', secret);
    const qr = await this.imageHelpers.generateQRCode(otp);
    return { secret, qr };
  }

  /**
   *
   * @param secret codigo secreto del usuario
   * @param token codigo del usuario
   * @returns si se a vereficado que es el usuario
   */
  verify(secret: string, token: string) {
    return authenticator.verify({ secret, token });
  }
}
