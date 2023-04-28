import { Http } from "../api"
import { EditProfieService } from "../app/dashboard/services/EditProfile2";


const http = new Http();

const srvEditProfile = new EditProfieService(http)

export const providers = () => {

	return {
		http,
		srvEditProfile
	}


}