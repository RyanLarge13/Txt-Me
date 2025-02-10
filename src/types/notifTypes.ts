import { Dispatch, SetStateAction } from "react";

export type SysNotif = {
  show: boolean;
  title: string;
  text: string;
  color: string;
  hasCancel: boolean;
  actions: Actions[];
};

export type Actions = {
  text: string;
  func: () => void;
};

export interface NotifCtxtProps {
  setSysNotif: Dispatch<SetStateAction<SysNotif>>;
  sysNotif: SysNotif;
}
