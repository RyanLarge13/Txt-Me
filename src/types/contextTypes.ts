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

import { Dispatch, SetStateAction } from "react";

interface Notifhdlr {
  closeNotif: () => void;
  setNotif: (
    title: string,
    text: string,
    hasCancel: boolean,
    actions: []
  ) => void;
}

type Actions = {
  text: string;
  func: () => void;
};

export type SysNotif = {
  show: boolean;
  title: string;
  text: string;
  color: string;
  hasCancel: boolean;
  actions: Actions[];
};

type User = {
  username: string;
  userId: number;
  email: string;
  phoneNumber: string;
};

type Contacts = {
  address: string;
  avatar: null | string;
  contactid: string;
  createdat: string;
  email: string;
  name: string;
  nickname: string;
  number: number;
  space: string;
  userid: string;
  website: string;
};

export interface ContextProps {
  setSysNotif: Dispatch<SetStateAction<SysNotif>>;
  setUser: Dispatch<SetStateAction<User>>;
  setToken: Dispatch<SetStateAction<string>>;
  setOpenChatsMenu: Dispatch<SetStateAction<boolean>>;
  setOpenUserMenu: Dispatch<SetStateAction<boolean>>;
  setNewChat: Dispatch<SetStateAction<boolean>>;
  setContacts: Dispatch<SetStateAction<Contacts[]>>;
  newChat: boolean;
  openUserMenu: boolean;
  openChatsMenu: boolean;
  sysNotif: SysNotif;
  user: User | null;
  notifHdlr: Notifhdlr;
  token: string;
  contacts: Contacts[];
}
