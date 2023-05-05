import { Http } from '../api';
import { AuthService } from '../app/auth/services/authService';
import { EditProfieService } from '../app/dashboard/services/EditProfileService';
import { FriendsService } from '../app/dashboard/services/FriendsService';

const http = new Http();

const editProfileService = new EditProfieService(http);
const authService = new AuthService(http);
const friendsService = new FriendsService(http);

export const providers = () => {
  return {
    http,
    editProfileService,
    authService,
    friendsService,
  };
};
