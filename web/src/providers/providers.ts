import { Http } from '../api';
import { AuthService } from '../app/auth/services/authService';
import { EditProfieService, ProfileService,FriendsService } from '../app/dashboard/services';

const http = new Http();

const editProfileService = new EditProfieService(http);
const profileService = new ProfileService(http);
const authService = new AuthService(http);
const friendsService = new FriendsService(http);

export const providers = () => {
  return {
    http,
    editProfileService,
    profileService,
    authService,
    friendsService,
  };
};
