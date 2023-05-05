import axios, { AxiosRequestConfig } from 'axios';
import { CONFIG } from '../config';

export interface HttpService {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: any): Promise<T>;
  put<T>(path: string, body: any): Promise<T>;
  patch<T>(path: string, body: any): Promise<T>;
  delete<T>(path: string): Promise<T>;
}

export class Http implements HttpService {
  private readonly url: string = CONFIG.API_URL;
  private timeout: number = 5000;

  private getConfig(): AxiosRequestConfig {
    return {
      timeout: this.timeout,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
  }

  constructor(timeout?: number) {
    if (timeout) this.timeout = timeout;
  }

  handleError(error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return 'Something is wrong';
  }

  async get<T>(path: string): Promise<T> {
    try {
      const { data } = await axios.get<T>(this.url + path, this.getConfig());
      return data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async post<T>(path: string, body: any): Promise<T> {
    try {
      const { data } = await axios.post<T>(
        this.url + path,
        body,
        this.getConfig(),
      );
      return data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async put<T>(path: string, body: any): Promise<T> {
    try {
      const { data } = await axios.put<T>(
        this.url + path,
        body,
        this.getConfig(),
      );
      return data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async patch<T>(path: string, body: any): Promise<T> {
    try {
      const { data } = await axios.patch<T>(
        this.url + path,
        body,
        this.getConfig(),
      );
      return data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async delete<T>(path: string): Promise<T> {
    try {
      const { data } = await axios.delete<T>(this.url + path, this.getConfig());
      return data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }
}
