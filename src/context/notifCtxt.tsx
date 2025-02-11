import React, { createContext, ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Actions, NotifCtxtProps, SysNotifType } from "../types/notifTypes.ts";

const NotifCtxt = createContext({} as NotifCtxtProps);

export const NotifProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [notifs, setNotifs] = useState<SysNotifType[]>([]);

  const addSuccessNotif = (
    title: string,
    text: string,
    hasCancel: boolean,
    actions: Actions[]
  ): void => {
    const id = uuidv4();
    const newNotif = {
      id: id,
      confirmation: false,
      title: title,
      text: text,
      color: "bg-primary",
      hasCancel: hasCancel,
      time: new Date(),
      actions: [{ text: "close", func: () => removeNotif(id) }, ...actions],
    };
    setNotifs((prev) => {
      return [...prev, newNotif];
    });
  };

  const addErrorNotif = (
    title: string,
    text: string,
    hasCancel: boolean,
    actions: Actions[]
  ): void => {
    const id = uuidv4();
    const newNotif = {
      id: id,
      confirmation: false,
      title: title,
      text: text,
      color: "bg-secondary",
      hasCancel: hasCancel,
      time: new Date(),
      actions: [{ text: "close", func: () => removeNotif(id) }, ...actions],
    };
    setNotifs((prev) => {
      return [...prev, newNotif];
    });
  };

  const showNetworkErrorNotif = (actions: Actions[]): void => {
    const id = uuidv4();
    const newNotif = {
      id: id,
      confirmation: false,
      title: "Network Error",
      text: "Please check your internet connection",
      color: "bg-secondary",
      hasCancel: false,
      time: new Date(),
      actions: [{ text: "close", func: () => removeNotif(id) }, ...actions],
    };
    setNotifs((prev) => {
      return [...prev, newNotif];
    });
  };

  const removeNotif = (id: string): void => {
    setNotifs((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAllNotifs = (): void => {
    setNotifs([]);
  };

  const confirmOperation = (
    title: string,
    text: string,
    actions: Actions[],
    callback
  ) => {
    const id = uuidv4();
    const newNotif = {
      id: id,
      confirmation: true,
      title,
      text,
      color: "bg-primary",
      hasCancel: false,
      time: new Date(),
      actions: [{ text: "close", func: () => removeNotif(id) }, ...actions],
    };
    setNotifs((prev) => {
      return [...prev, newNotif];
    });
  };

  return (
    <NotifCtxt.Provider
      value={{
        notifs,
        addSuccessNotif,
        addErrorNotif,
        removeNotif,
        showNetworkErrorNotif,
        clearAllNotifs,
      }}
    >
      {children}
    </NotifCtxt.Provider>
  );
};

export default NotifCtxt;
