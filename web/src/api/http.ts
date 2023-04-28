import axios from "axios";

interface HttpService<T> {
	get<T>(path: string): Promise<T>;
	post<T>(path: string, body: any): Promise<T>;
}

export class Http implements HttpService {

	async get<T>(path: string): Promise<T> {
		const { data } = await axios.get<T>(path);
		return data;
	}

	async post<T>(path: string, body: any): Promise<T> {
		const { data } = await axios.post<T>(path, body);
		return data;
	}
}