import { SetStateAction, Dispatch } from "react";

interface Notifhdlr {
  closeNotif: () => void;
  setNotif: (
    title: string,
    text: string,
    hasCancel: boolean,
    actions: Actions[] | []
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

export type AllMessages = {
  contact: Contacts;
  messages: Message[];
};

export type Contacts = {
  address: string;
  avatar: null | string;
  contactid: number;
  createdat: string;
  email: string;
  name: string;
  nickname: string;
  number: number;
  space: string;
  userid: string;
  website: string;
};

type Message = {
  fromid: string | undefined;
  message: string;
  time: Date;
};

export type MessageSession = {
  messages: Message[];
  contact: Contacts;
};

export interface UserProps {
  setSysNotif: Dispatch<SetStateAction<SysNotif>>;
  setUser: Dispatch<SetStateAction<User>>;
  setToken: Dispatch<SetStateAction<string>>;
  setOpenChatsMenu: Dispatch<SetStateAction<boolean>>;
  setNewChat: Dispatch<SetStateAction<boolean>>;
  setContacts: Dispatch<SetStateAction<Contacts[] | []>>;
  setMessageSession: Dispatch<SetStateAction<MessageSession | null>>;
  setAllMessages: Dispatch<SetStateAction<AllMessages[] | []>>;
  newChat: boolean;
  openChatsMenu: boolean;
  sysNotif: SysNotif;
  user: User | null;
  notifHdlr: Notifhdlr;
  token: string;
  contacts: Contacts[] | [];
  messageSession: MessageSession | null;
  allMessages: AllMessages[] | [];
}
