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

export interface NotifCtxtProps {
  notifs: SysNotifType[];
  storedNotifs: SysNotifType[];
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
}
