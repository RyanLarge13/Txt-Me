/*
Txt Me - A web based messaging platform
Copyright (C) 2025 Ryan Large

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import Axios, { AxiosResponse } from "axios";

import { Contacts } from "../types/userTypes";

const devUrl = import.meta.env.VITE_API_URL;

// User and verification fetches --------------------------------
export const API_SignUp = (newUser: {
  username: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AxiosResponse> => {
  const res = Axios.post(`${devUrl}/signup`, { newUser });
  return res;
};

// Pass the pass code received by phone back to the server to verify user information
export const API_VerifyPhone = (
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
export const API_VerifyEmail = (
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
export const API_VerifyPhoneLogin = (
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
export const API_VerifyEmailLogin = (
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
export const API_FetchUserData = (token: string): Promise<AxiosResponse> => {
  const res = Axios.get(`${devUrl}/login/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// Request a new pin via email to login
export const API_PinEmail = (email: string): Promise<AxiosResponse> => {
  const res = Axios.post(`${devUrl}/verify/email/newpin`, { email: email });
  return res;
};

// Request a new pin via phone to login
export const API_PinPhone = (phone: string): Promise<AxiosResponse> => {
  const res = Axios.post(`${devUrl}/verify/phone/newpin`, { phone });
  return res;
};

// Retrieve the users contacts information
export const API_GetContacts = (token: string): Promise<AxiosResponse> => {
  const res = Axios.get(`${devUrl}/user/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
// User and verification fetches --------------------------------

// Contact related requests --------------------------------------
export const API_AddContact = (
  token: string,
  contact: Contacts
): Promise<AxiosResponse> => {
  const res = Axios.post(
    `${devUrl}/contacts/add`,
    { contact: contact },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res;
};
// Contact related requests --------------------------------------

// Message related requests --------------------------------------
// Not implemented on server yet
export const API_GetMessages = (token: string): Promise<AxiosResponse> => {
  const res = Axios.get(`${devUrl}/messages/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
// Message related requests --------------------------------------
