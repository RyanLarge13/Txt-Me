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

export type Actions = {
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

export type User = {
  username: string;
  userId: number;
  email: string;
  phoneNumber: string;
};

export type AllMessages = Map<number, Message[]>;

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

export type Message = {
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
  setUser: (user: User) => void;
  setToken: (value: string) => void;
  setOpenChatsMenu: Dispatch<SetStateAction<boolean>>;
  setNewChat: Dispatch<SetStateAction<boolean>>;
  setContacts: Dispatch<SetStateAction<Contacts[] | []>>;
  setMessageSession: Dispatch<SetStateAction<MessageSession | null>>;
  setAllMessages: Dispatch<SetStateAction<Map<number, Message[]>>>;
  newChat: boolean;
  openChatsMenu: boolean;
  sysNotif: SysNotif;
  user: User | null;
  notifHdlr: Notifhdlr;
  token: string | null;
  contacts: Contacts[] | [];
  messageSession: MessageSession | null;
  allMessages: AllMessages;
}
