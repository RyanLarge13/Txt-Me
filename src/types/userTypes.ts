import { SetStateAction, Dispatch } from "react";

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

export type AllMessages = Map<
  number,
  { contact: Contacts; messages: Message[] }
>;

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

export interface NotifCtxtProps {
  notifHdlr: {
    closeNotif: () => void;
    setNotif: (
      title: string,
      text: string,
      hasCancel: boolean,
      actions: Actions[] | []
    ) => void;
  };
}

export interface UserProps {
  setUser: (user: User) => void;
  setToken: (value: string) => void;
  setOpenChatsMenu: Dispatch<SetStateAction<boolean>>;
  setNewChat: Dispatch<SetStateAction<boolean>>;
  setContacts: Dispatch<SetStateAction<Contacts[] | []>>;
  setMessageSession: Dispatch<SetStateAction<MessageSession | null>>;
  setAllMessages: Dispatch<SetStateAction<Map<number, Message[]>>>;
  newChat: boolean;
  openChatsMenu: boolean;
  user: User | null;
  token: string | null;
  contacts: Contacts[] | [];
  messageSession: MessageSession | null;
  allMessages: AllMessages;
}
