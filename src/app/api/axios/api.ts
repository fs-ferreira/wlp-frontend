import axios, { AxiosError } from 'axios'
import { AuthTokenError } from './errors/AuthTokenError'
import { signOut } from 'next-auth/react';


export function setupAPIClient(token:string){
  const api = axios.create({
    baseURL: process.env.BACKEND_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })  
  
  
  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if(error?.response?.status === 401){
      if(typeof window !== undefined){
        signOut();
      }else{
        return Promise.reject(new AuthTokenError())
      }
    }
    return Promise.reject(error);
  })
  return api;

}