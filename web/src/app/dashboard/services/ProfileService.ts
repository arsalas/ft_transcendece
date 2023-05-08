import { HttpService } from '../../../api/http';
import { IProfile, IUserProfile } from '../../../interfaces';

export class ProfileService {
  constructor(private http: HttpService) {}

  async get(username: string) {
    try {
      return await this.http.get<IUserProfile>('/user/' + username);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  //   async generateQRCode() {
  //     try {
  //       return await this.http.get<{ qr: string }>('/auth/generate-tfa');
  //     } catch (error) {
  //       throw new Error(error as string);
  //     }
  //   }

  //   async activateTFA(token: string) {
  //     try {
  //       return await this.http.post<{ qr: string }>('/auth/activate-tfa', {
  //         token,
  //       });
  //     } catch (error) {
  //       throw new Error(error as string);
  //     }
  //   }

  //   async desactivateTFA(token: string) {
  //     try {
  //       return await this.http.post<{ qr: string }>('/auth/desactivate-tfa', {
  //         token,
  //       });
  //     } catch (error) {
  //       throw new Error(error as string);
  //     }
  //   }
}

// async signIn(code: string) {
//     try {
//       return await this.http.get<ISignin & ITwoFactorAuth>(
//         '/auth/signin/' + code,
//       );
//     } catch (error) {
//       throw new Error('error');
//     }
//   }
