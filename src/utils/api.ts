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

export const verifyPhone = (
  token: string,
  pin: string
): Promise<AxiosResponse> => {
  const res = Axios.post(
    `${devUrl}/verify/phone`,
    { pin },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const verifyEmail = (
  token: string,
  pin: string
): Promise<AxiosResponse> => {
  const res = Axios.post(
    `${devUrl}/verify/email`,
    { pin },
    { headers: { Authorization: `Bearer ${token} ` } }
  );
  return res;
};

export const fetchUserData = (token: string): Promise<AxiosResponse> => {
  const res = Axios.get(`${devUrl}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
