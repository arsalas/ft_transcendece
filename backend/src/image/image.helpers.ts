import { Injectable } from '@nestjs/common';
import { toDataUR } from 'qrcode';

@Injectable()
export class ImageHelpers {
  /**
   * Genera una imagen con un codigoQR
   * @param url
   * @returns imagen QR
   */
  async generateQRCode(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      toDataURL(url, (err: Error, imageUrl: string) => {
        if (err) reject(err);
        resolve(imageUrl);
      });
    });
  }
}
