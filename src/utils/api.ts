import Axios, { AxiosResponse } from "axios";
const devUrl = "http://localhost:8080";

export const signUp = (newUser: {
  username: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AxiosResponse> => {
  const res = Axios.post(`${devUrl}/signup`, { newUser });
  return res;
};
