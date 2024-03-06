import { SetStateAction, Dispatch } from "react";

type Actions = {
  text: string;
  func: () => void;
};

type SysNotif = {
  show: boolean;
  title: string;
  text: string;
  color: string;
  hasCancel: boolean;
  actions: Actions[];
};

export interface ContextProps {
  setSysNotif: Dispatch<SetStateAction<SysNotif>>;
  sysNotif: SysNotif;
}
