import { Http } from '../api';
import { AuthService } from '../app/auth/services/authService';
import { EditProfieService } from '../app/dashboard/services/EditProfileService';

const http = new Http();

const editProfileService = new EditProfieService(http);
const authService = new AuthService(http);

export const providers = () => {
  return {
    http,
    editProfileService,
    authService,
  };
};
