import Axios, { AxiosResponse } from "axios";
const devUrl = import.meta.env.VITE_API_URL;

// User and verification fetches --------------------------------
export const signUp = (newUser: {
  username: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AxiosResponse> => {
  const res = Axios.post(`${devUrl}/signup`, { newUser });
  return res;
};

// Pass the pass code received by phone back to the server to verify user information
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

// Pass the pass code received by email back to server to verify user information
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

// Pass the pass code received by phone back to the server to login
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

// Pass the pass code received by email back to server to login
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

// Grab latest user information, Includes all data related to user
export const fetchUserData = (token: string): Promise<AxiosResponse> => {
  const res = Axios.get(`${devUrl}/login/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// Request a new pin via email to login
export const pinEmail = (email: string): Promise<AxiosResponse> => {
  const res = Axios.post(`${devUrl}/verify/email/newpin`, { email: email });
  return res;
};

// Request a new pin via phone to login
export const pinPhone = (phone: string): Promise<AxiosResponse> => {
  const res = Axios.post(`${devUrl}/verify/phone/newpin`, { phone });
  return res;
};

// Retrieve the users contacta information
export const getContacts = (token: string): Promise<AxiosResponse> => {
  const res = Axios.get(`${devUrl}/user/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
// User and verification fetches --------------------------------
