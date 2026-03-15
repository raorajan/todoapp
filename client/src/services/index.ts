import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type RequestType =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'PUT'
  | 'PATCH'
  | 'MULTIPART'
  | 'MULTIPART_PUT'
  | 'JSON';

export interface ApiOptions {
  [key: string]: any;
}

function getHeaderConfig(requestType: RequestType, options: ApiOptions = {}): AxiosRequestConfig {
  const contentType =
    requestType === 'MULTIPART' || requestType === 'MULTIPART_PUT'
      ? 'multipart/form-data'
      : 'application/json';

  const headers: Record<string, string> = {
    'Content-Type': contentType,
    Accept: '*/*',
    ...(requestType === 'GET'
      ? {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        }
      : {}),
  };

  const config: AxiosRequestConfig = {
    headers,
    params: { ...options },
    timeout: 60 * 10 * 1000,
    withCredentials: true,
  };

  return config;
}


export const fetchFromApiServer = (
  requestType: RequestType,
  uri: string,
  data?: any,
  options: ApiOptions = {},
): Promise<AxiosResponse<any>> => {
  let baseUrl = (import.meta.env.VITE_API_URL as string) || '';
  baseUrl = baseUrl.replace(/\/+$/, '');
  const normalizedUri = uri.startsWith('/') ? uri : `/${uri}`;
  const url = `${baseUrl}${normalizedUri}`;

  const config = getHeaderConfig(requestType, options);

  if (requestType === 'GET') {
    return axios.get(url, config);
  } else if (requestType === 'POST') {
    return axios.post(url, data, config);
  } else if (requestType === 'DELETE') {
    return axios.delete(url, { ...config, data });
  } else if (requestType === 'PUT') {
    return axios.put(url, data, config);
  } else if (requestType === 'PATCH') {
    return axios.patch(url, data, config);
  } else if (requestType === 'MULTIPART') {
    return axios.post(url, data, config);
  } else if (requestType === 'MULTIPART_PUT') {
    return axios.put(url, data, config);
  } else if (requestType === 'JSON') {
    return axios.get(url, { ...config });
  }

  return axios({ url, method: 'get', ...config });
};

export default fetchFromApiServer;
