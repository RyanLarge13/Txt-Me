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

import { AppSettingsType, ThemeType, UserType } from "../types/appDataTypes";
import { MessageType } from "../types/messageTypes";
import { Crypto_GenRSAKeyPairAndExportAsArrayBuffers } from "./crypto";

const defaultRSAKeyPair = await Crypto_GenRSAKeyPairAndExportAsArrayBuffers();

export const defaultUser: UserType = {
  userId: "",
  authToken: "",
  username: "",
  email: "",
  phoneNumber: "",
  RSAKeyPair: {
    private: defaultRSAKeyPair.private,
    public: defaultRSAKeyPair.public,
    expiresAt: new Date(new Date().getDate() + 7),
  },
};

export const defaultTheme: ThemeType = {
  darkMode: true,
  accent: "#fff",
  background: "none",
  animations: {
    speed: 0.25,
    spring: true,
  },
};

export const defaultMessage: MessageType = {
  messageid: "",
  message: "",
  sent: true,
  sentat: new Date(), // Must change and update when using this default object,
  delivered: false,
  deliveredat: null,
  read: false,
  readat: null,
  fromnumber: "",
  tonumber: "",
  error: false,
  synced: false,
};

export const defaultAppSettings: AppSettingsType = {
  initialized: false,
  authToken: "",
  locked: false,
  passwordType: "pin",
  showOnline: false,
  webPushSubscription: {
    subscription: null,
    subscribed: false,
  },
};

export const defaultContact = {
  contactid: "",
  name: "",
  email: "",
  number: "",
  createdat: new Date(), // Must change and update when using this default object,
  space: "",
  nickname: "",
  address: "",
  website: "",
  avatar: null,
  synced: false,
};
