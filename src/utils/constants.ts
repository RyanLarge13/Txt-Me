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

export const defaultUser = {
  userId: 0,
  authToken: "",
  username: "",
  email: "",
  phoneNumber: "",
};

export const defaultTheme = {
  darkMode: true,
  accent: "#fff",
  background: "none",
  animations: {
    speed: 0.25,
    spring: true,
  },
};

export const defaultMessage = {
  messageid: 0,
  message: "",
  sent: true,
  sentat: null,
  delivered: false,
  deliveredat: null,
  read: false,
  readat: null,
  fromnumber: "",
  tonumber: "",
};

export const defaultAppSettings = {
  initialized: false,
  authToken: "",
  locked: false,
  passwordType: "pin",
  showOnline: false,
};

export const defaultContact = {
  contactid: "",
  name: "",
  email: "",
  number: "",
  createdat: new Date(),
  space: "",
  nickname: "",
  address: "",
  website: "",
  avatar: null,
  synced: false,
};
