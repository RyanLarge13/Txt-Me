import { SetStateAction, Dispatch } from "react";

interface Notifhdlr {
  closeNotif: () => void;
  setNotif: (
    title: string,
    text: string,
    hasCancel: boolean,
    actions: Actions[]
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

export interface ContextProps {
  setSysNotif: Dispatch<SetStateAction<SysNotif>>;
  setUser: Dispatch<SetStateAction<User>>;
  setToken: Dispatch<SetStateAction<string>>;
  setOpenChatsMenu: Dispatch<SetStateAction<boolean>>;
  setOpenUserMenu: Dispatch<SetStateAction<boolean>>;
  setNewChat: Dispatch<SetStateAction<boolean>>;
  newChat: boolean;
  openUserMenu: boolean;
  openChatsMenu: boolean;
  sysNotif: SysNotif;
  user: User | null;
  notifHdlr: Notifhdlr;
  token: string;
}
