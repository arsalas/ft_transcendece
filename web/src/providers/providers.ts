import { Http } from '../api';
import { AuthService } from '../app/auth/services/authService';
import { EditProfieService, ProfileService } from '../app/dashboard/services';

const http = new Http();

const editProfileService = new EditProfieService(http);
const profileService = new ProfileService(http);
const authService = new AuthService(http);

export const providers = () => {
  return {
    http,
    editProfileService,
    profileService,
    authService,
  };
};
