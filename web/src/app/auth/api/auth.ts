import { AxiosResponse } from 'axios';
import api from '../../../api'


interface ISignin {
    token: string;
}
export const signIn = async (code: string): Promise<ISignin> => {
    try {
        const { data } = await api.get("/auth/signin/" + code);
        console.log(data);
        return data
    } catch (error) {
        throw new Error("error");
    }

}

