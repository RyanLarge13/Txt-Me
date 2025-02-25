import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

export type SysNotifType = {
  id: string;
  confirmation: boolean;
  title: string;
  text: string;
  color: string;
  hasCancel: boolean;
  time: Date;
  actions: Actions[];
};

export type Actions = {
  text: string;
  func: () => void;
};

export interface NotifActionProps {
  addSuccessNotif: (
    title: string,
    text: string,
    hasCancel: boolean,
    actions: Actions[]
  ) => void;
  addErrorNotif: (
    title: string,
    text: string,
    hasCancel: boolean,
    actions: Actions[]
  ) => void;
  removeNotif: (id: string) => void;
  showNetworkErrorNotif: (actions: Actions[]) => void;
  clearAllNotifs: () => void;
  setStoredNotifs: Dispatch<SetStateAction<SysNotifType[]>>;
  handleAPIErrorNotif: (err: AxiosError) => void;
}

export interface NotifStateProps {
  notifs: SysNotifType[];
  storedNotifs: SysNotifType[];
}
