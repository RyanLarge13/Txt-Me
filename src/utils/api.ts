import Axios, { AxiosResponse } from "axios";
const devUrl = import.meta.env.VITE_API_URL;

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

export const verifyPhoneLogin = (
  email: string,
  pin: string
): Promise<AxiosResponse> => {
  const res = Axios.post(`${devUrl}/verify/pin/phone`, {
    email: email,
    pin: pin,
  });
  return res;
};

export const verifyEmailLogin = (
  email: string,
  pin: string
): Promise<AxiosResponse> => {
  const res = Axios.post(`${devUrl}/verify/pin/email`, {
    email: email,
    pin: pin,
  });
  return res;
};

export const fetchUserData = (token: string): Promise<AxiosResponse> => {
  const res = Axios.get(`${devUrl}/login/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const pinEmail = (email: string): Promise<AxiosResponse> => {
  const res = Axios.post(`${devUrl}/verify/email/newpin`, { email: email });
  return res;
};

export const pinPhone = (phone: string): Promise<AxiosResponse> => {
  const res = Axios.post(`${devUrl}/verify/phone/newpin`, { phone });
  return res;
};

export const getContacts = (token: string): Promise<AxiosResponse> => {
  const res = Axios.get(`${devUrl}/user/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
