
import api from '../../../api'



export const updateProfile = async (profile: any): Promise<void> => {
	try {
		const { data } = await api.put("/user", profile);
		console.log(data);
		return data
	} catch (error) {
		throw new Error("error");
	}

}
