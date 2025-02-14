/*
Txt Me - A learn to draw program
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

import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Actions, NotifCtxtProps, SysNotifType } from "../types/notifTypes.ts";

const NotifStateCtxt = createContext({} as NotifCtxtProps);
const NotifActionsCtxt = createContext({} as any);

export const NotifProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [notifs, setNotifs] = useState<SysNotifType[]>([]);
  const [storedNotifs, setStoredNotifs] = useState<SysNotifType[]>([]);

  const addSuccessNotif = useCallback(
    (
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
    },
    []
  );

  const addErrorNotif = useCallback(
    (
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
    },
    []
  );

  const showNetworkErrorNotif = useCallback((actions: Actions[]): void => {
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
  }, []);

  const removeNotif = useCallback((id: string): void => {
    setNotifs((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAllNotifs = useCallback((): void => {
    setNotifs([]);
  }, []);

  return (
    <NotifStateCtxt.Provider
      value={{
        notifs,
        storedNotifs,
      }}
    >
      <NotifActionsCtxt.Provider
        value={{
          addSuccessNotif,
          addErrorNotif,
          removeNotif,
          showNetworkErrorNotif,
          clearAllNotifs,
          setStoredNotifs,
        }}
      >
        {children}
      </NotifActionsCtxt.Provider>
    </NotifStateCtxt.Provider>
  );
};

export const useNotifState = () => {
  const context = useContext(NotifStateCtxt);
  if (!context)
    throw new Error("useNotifState must be used within a NotifProvider");
  return context;
};

export const useNotifActions = () => {
  const context = useContext(NotifActionsCtxt);
  if (!context)
    throw new Error("useNotifActions must be used within a NotifProvider");
  return context;
};
